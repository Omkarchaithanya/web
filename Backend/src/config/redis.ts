import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  return redis;
}

export async function connectRedis(): Promise<void> {
  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    redis.on('error', (err) => {
      logger.warn('Redis connection error', { error: err.message });
    });

    await redis.connect();
    logger.info('Redis connected');
  } catch (error) {
    logger.warn('Redis unavailable — running without cache/rate-limit store', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    redis = null;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

/** Unused helper kept for future response caching; prefer explicit Redis use at call sites. */
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  const value = await redis.get(key);
  return value ? (JSON.parse(value) as T) : null;
}

/** Unused helper kept for future response caching. */
export async function cacheSet(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
  if (!redis) return;
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
}

/** Unused helper kept for future response caching. */
export async function cacheDel(key: string): Promise<void> {
  if (!redis) return;
  await redis.del(key);
}

/** Unused helper kept for future response caching. */
export async function cacheDelPattern(pattern: string): Promise<void> {
  if (!redis) return;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
