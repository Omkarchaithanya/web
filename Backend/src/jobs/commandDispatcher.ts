import { env } from '../config/env';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { createAuditLog } from '../services/audit.service';

export class CommandDispatcher {
  private intervalId: NodeJS.Timeout | null = null;
  private ticking = false;

  start() {
    this.intervalId = setInterval(() => {
      void this.tick();
    }, 3000);
    logger.info('Command dispatcher started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async tick() {
    if (this.ticking) return;
    this.ticking = true;
    try {
      const pending = await prisma.deviceCommand.findMany({
        where: { status: 'PENDING' },
        orderBy: { issuedAt: 'asc' },
        take: 20,
      });

      for (const cmd of pending) {
        if (env.PLC_MODE === 'simulated') {
          await prisma.deviceCommand.update({
            where: { id: cmd.id },
            data: {
              status: 'ACKNOWLEDGED',
              completedAt: new Date(),
            },
          });
          await createAuditLog({
            userId: cmd.issuedBy,
            action: 'COMMAND_ACKNOWLEDGED',
            resource: 'DEVICE_COMMAND',
            resourceId: cmd.id,
            metadata: { mode: 'simulated', commandType: cmd.commandType },
          });
          continue;
        }

        if (!env.REGISTER_MAP_CONFIRMED) {
          await prisma.deviceCommand.update({
            where: { id: cmd.id },
            data: {
              status: 'FAILED',
              completedAt: new Date(),
              errorMessage: 'Live Modbus writes require REGISTER_MAP_CONFIRMED=true',
            },
          });
          continue;
        }

        // Live write path reserved for verified register map
        await prisma.deviceCommand.update({
          where: { id: cmd.id },
          data: {
            status: 'FAILED',
            completedAt: new Date(),
            errorMessage: 'Live Modbus command dispatch not yet implemented for verified map',
          },
        });
      }
    } catch (err) {
      logger.error('Command dispatcher tick failed', err);
    } finally {
      this.ticking = false;
    }
  }
}

export const commandDispatcher = new CommandDispatcher();
