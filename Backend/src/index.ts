import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { connectRedis, disconnectRedis } from './config/redis';
import { attachWebSocketServer } from './websocket/wsServer';
import { ingestionLoop } from './jobs/plc/ingestionLoop';

async function bootstrap() {
  try {
    // Connect to external services
    await connectDatabase();
    await connectRedis();

    const server = http.createServer(app);

    // Attach WebSocket server
    attachWebSocketServer(server);

    server.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
      // Start the IoT ingestion loop
      ingestionLoop.start();
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      ingestionLoop.stop();
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDatabase();
        await disconnectRedis();
        process.exit(0);
      });

      // Force close if taking too long
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
