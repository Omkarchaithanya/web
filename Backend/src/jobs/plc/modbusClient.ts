import ModbusRTU from 'modbus-serial';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class PLCModbusClient {
  private client: ModbusRTU;
  private isConnected: boolean = false;

  constructor() {
    this.client = new ModbusRTU();
  }

  async connect() {
    if (this.isConnected) return;
    try {
      await this.client.connectRTUBuffered(env.PLC_COM_PORT, {
        baudRate: env.PLC_BAUD_RATE,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
      });
      this.client.setID(env.PLC_SLAVE_ID);
      this.isConnected = true;
      logger.info(`Modbus RTU connected on ${env.PLC_COM_PORT}`);
    } catch (err) {
      logger.error('Failed to connect to PLC', err);
      throw err;
    }
  }

  async readHoldingRegisters(address: number, length: number) {
    if (!this.isConnected) await this.connect();
    return this.client.readHoldingRegisters(address, length);
  }

  async readCoils(address: number, length: number) {
    if (!this.isConnected) await this.connect();
    return this.client.readCoils(address, length);
  }

  close() {
    if (this.isConnected) {
      this.client.close(() => {
        this.isConnected = false;
        logger.info('Modbus RTU disconnected');
      });
    }
  }
}
