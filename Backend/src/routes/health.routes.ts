import { Router } from 'express';
import { prisma } from '../config/database';
import { getRedis } from '../config/redis';

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: healthy or degraded
 *       503:
 *         description: unhealthy
 */
router.get('/', async (_req, res) => {
  const checks: Record<string, 'up' | 'down'> = { database: 'down', redis: 'down' };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'up';
  } catch {
    checks.database = 'down';
  }

  try {
    const redis = getRedis();
    if (redis) {
      await redis.ping();
      checks.redis = 'up';
    } else {
      checks.redis = 'down';
    }
  } catch {
    checks.redis = 'down';
  }

  if (checks.database === 'down') {
    res.status(503).json({
      status: 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const status = checks.redis === 'up' ? 'healthy' : 'degraded';
  res.status(200).json({
    status,
    checks,
    timestamp: new Date().toISOString(),
  });
});

export default router;
