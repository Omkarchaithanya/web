import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { env } from '../config/env';
import { getRedis } from '../config/redis';

function createStore(prefix: string) {
  const redis = getRedis();
  if (!redis) return undefined;
  return new RedisStore({
    sendCommand: (...args: string[]) => (redis as any).call(...args),
    prefix: `rl:${prefix}:`,
  });
}

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('global'),
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Too many requests. Please try again later.' },
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('auth'),
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Too many authentication attempts.' },
  },
});

export const publicFormRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('forms'),
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Submission limit reached. Try again later.' },
  },
});

export const iotRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('iot'),
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'IoT ingestion rate limit exceeded.' },
  },
});
