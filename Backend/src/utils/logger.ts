import winston from 'winston';
import { env, isProduction } from '../config/env';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const devFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}]: ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: 'urbantree-api' },
  transports: [
    new winston.transports.Console({
      format: isProduction ? combine(timestamp(), json()) : combine(colorize(), timestamp(), devFormat),
    }),
  ],
});

if (isProduction) {
  logger.add(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  );
  logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
}
