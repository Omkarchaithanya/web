import { env } from '../../config/env';
import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';
import { PLCModbusClient } from './modbusClient';
import { PLCSimulator } from './simulator';
import { registerMap } from './registerMap';
import { WsBroadcaster } from '../../websocket/broadcast';
import { evaluateTelemetryAlerts } from '../../services/telemetry-alert.service';

export class IngestionLoop {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private modbusClient: PLCModbusClient | null = null;
  private polling = false;

  async start() {
    if (this.isRunning) return;

    if (env.PLC_MODE === 'live') {
      if (!env.REGISTER_MAP_CONFIRMED) {
        throw new Error(
          'PLC_MODE=live requires REGISTER_MAP_CONFIRMED=true (register map still unverified)',
        );
      }
      this.modbusClient = new PLCModbusClient();
      await this.modbusClient.connect();
    }

    this.isRunning = true;
    logger.info(`Starting PLC Ingestion Loop in ${env.PLC_MODE} mode`);

    this.intervalId = setInterval(() => {
      void this.pollAllDevices();
    }, env.PLC_POLL_INTERVAL_MS);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    if (this.modbusClient) {
      this.modbusClient.close();
    }
    logger.info('PLC Ingestion Loop stopped');
  }

  private async readLive() {
    if (!this.modbusClient) {
      throw new Error('Modbus client not initialized');
    }
    const aqi = await this.modbusClient.readHoldingRegisters(registerMap.AQI, 8);
    const filters = await this.modbusClient.readHoldingRegisters(registerMap.HEPA_PERCENT, 3);
    const coils = await this.modbusClient.readCoils(registerMap.UV_LIGHT_COIL, 4);

    return {
      readings: {
        aqi: aqi.data[0] ?? 0,
        pm1: aqi.data[1],
        pm25: aqi.data[2],
        pm10: aqi.data[3],
        co2: aqi.data[4],
        voc: aqi.data[5],
        temp: aqi.data[6],
        humidity: aqi.data[7],
      },
      filters: {
        hepaPercent: filters.data[0] ?? 0,
        carbonPercent: filters.data[1] ?? 0,
        prefilterPercent: filters.data[2] ?? 0,
        uvLight: Boolean(coils.data[0]),
        ionizer: Boolean(coils.data[1]),
        mossChamber: Boolean(coils.data[2]),
        cycloneSeparator: Boolean(coils.data[3]),
      },
    };
  }

  private async pollAllDevices() {
    if (this.polling) {
      logger.warn('Skipping PLC poll — previous tick still running');
      return;
    }
    this.polling = true;

    try {
      const devices = await prisma.device.findMany({ select: { id: true, zoneId: true } });

      for (const device of devices) {
        let readings;
        let filters;

        if (env.PLC_MODE === 'simulated') {
          readings = PLCSimulator.getSensorReadings();
          filters = PLCSimulator.getFilterStatus();
        } else {
          const live = await this.readLive();
          readings = live.readings;
          filters = live.filters;
        }

        const readingRecord = await prisma.sensorReading.create({
          data: {
            deviceId: device.id,
            ...readings,
          },
        });

        const filterRecord = await prisma.filterStatus.create({
          data: {
            deviceId: device.id,
            ...filters,
          },
        });

        await prisma.device.update({
          where: { id: device.id },
          data: { lastSyncAt: new Date(), status: 'ONLINE' },
        });

        await evaluateTelemetryAlerts({
          deviceId: device.id,
          zoneId: device.zoneId,
          readings: readingRecord,
          filters: filterRecord,
        });

        WsBroadcaster.broadcast(`device:${device.id}`, 'telemetry', {
          readings: readingRecord,
          filters: filterRecord,
        });
      }
    } catch (err) {
      logger.error('Error in PLC ingestion loop', err);
    } finally {
      this.polling = false;
    }
  }
}

export const ingestionLoop = new IngestionLoop();
