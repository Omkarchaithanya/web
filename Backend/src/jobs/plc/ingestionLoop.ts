import { env } from '../../config/env';
import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';
import { PLCModbusClient } from './modbusClient';
import { PLCSimulator } from './simulator';
import { WsBroadcaster } from '../../websocket/broadcast';

export class IngestionLoop {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private modbusClient: PLCModbusClient | null = null;

  constructor() {
    if (env.PLC_MODE === 'live') {
      this.modbusClient = new PLCModbusClient();
    }
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    logger.info(`Starting PLC Ingestion Loop in ${env.PLC_MODE} mode`);

    this.intervalId = setInterval(async () => {
      await this.pollAllDevices();
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

  private async pollAllDevices() {
    try {
      const devices = await prisma.device.findMany({ select: { id: true, zoneId: true } });

      for (const device of devices) {
        let readings;
        let filters;

        if (env.PLC_MODE === 'simulated') {
          readings = PLCSimulator.getSensorReadings();
          filters = PLCSimulator.getFilterStatus();
        } else {
          // LIVE MODE (UNCONFIRMED - needs real register testing)
          // For now, if we hit this without hardware, we'd wrap in try/catch and fallback
          // Assuming it's connected to 1 COM port per Edge Gateway, polling the PLC
          // ... 
          logger.warn('Live mode PLC read not fully implemented (requires hardware testing)');
          readings = PLCSimulator.getSensorReadings();
          filters = PLCSimulator.getFilterStatus();
        }

        // Store reading
        const readingRecord = await prisma.sensorReading.create({
          data: {
            deviceId: device.id,
            ...readings
          }
        });

        const filterRecord = await prisma.filterStatus.create({
          data: {
            deviceId: device.id,
            ...filters
          }
        });

        // Update Device lastSyncAt
        await prisma.device.update({
          where: { id: device.id },
          data: { lastSyncAt: new Date(), status: 'ONLINE' }
        });

        // Broadcast to WebSocket clients
        WsBroadcaster.broadcast(`device:${device.id}`, 'telemetry', {
          readings: readingRecord,
          filters: filterRecord
        });
      }
    } catch (err) {
      logger.error('Error in PLC ingestion loop', err);
    }
  }
}

export const ingestionLoop = new IngestionLoop();
