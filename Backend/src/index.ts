import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import { attachWebSocketServer } from './websocket/wsServer';
import { ingestionLoop } from './jobs/plc/ingestionLoop';
import { retentionJob } from './jobs/retention';
import { commandDispatcher } from './jobs/commandDispatcher';

async function bootstrap() {
  try {
    await connectDatabase();
    await connectRedis();

    const server = http.createServer(app);
    attachWebSocketServer(server);

    server.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
      void ingestionLoop.start().catch((err) => {
        logger.error('Failed to start PLC ingestion loop', err);
        if (env.PLC_MODE === 'live') {
          process.exit(1);
        }
      });
      retentionJob.start();
      commandDispatcher.start();
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      ingestionLoop.stop();
      retentionJob.stop();
      commandDispatcher.stop();
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDatabase();
        await disconnectRedis();
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to bootstrap application', error);
    process.exit(1);
  }
}

bootstrap();
