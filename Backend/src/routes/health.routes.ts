import { Router } from 'express';
import { prisma } from '../config/database';
import { getRedis } from '../config/redis';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    // Check DB
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis
    const redis = getRedis();
    if (redis) {
      await redis.ping();
    } else {
      throw new Error('Redis not connected');
    }

    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Service Unavailable' });
  }
});

export default router;
