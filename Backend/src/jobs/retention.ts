import { env } from '../config/env';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class RetentionJob {
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    // Run once shortly after boot, then daily
    setTimeout(() => {
      void this.run();
    }, 15_000);
    this.intervalId = setInterval(() => {
      void this.run();
    }, 24 * 60 * 60 * 1000);
    logger.info(`Retention job scheduled (keep ${env.SENSOR_RETENTION_DAYS} days)`);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async run() {
    const cutoff = new Date(Date.now() - env.SENSOR_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    try {
      const [readings, filters] = await Promise.all([
        prisma.sensorReading.deleteMany({ where: { recordedAt: { lt: cutoff } } }),
        prisma.filterStatus.deleteMany({ where: { recordedAt: { lt: cutoff } } }),
      ]);
      logger.info('Retention cleanup complete', {
        cutoff: cutoff.toISOString(),
        deletedReadings: readings.count,
        deletedFilters: filters.count,
      });
    } catch (err) {
      logger.error('Retention cleanup failed', err);
    }
  }
}

export const retentionJob = new RetentionJob();
