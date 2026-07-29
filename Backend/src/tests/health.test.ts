import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';

vi.mock('../config/database', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
  },
  connectDatabase: vi.fn(),
  disconnectDatabase: vi.fn(),
}));

vi.mock('../config/redis', () => ({
  getRedis: vi.fn().mockReturnValue({
    ping: vi.fn().mockResolvedValue('PONG'),
    call: vi.fn().mockResolvedValue(null),
  }),
  connectRedis: vi.fn(),
  disconnectRedis: vi.fn(),
}));

vi.mock('express-rate-limit', () => ({
  default: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('rate-limit-redis', () => ({
  default: class {},
}));

describe('Health API', () => {
  it(
    'returns healthy when DB and Redis are up',
    async () => {
      const { default: app } = await import('../app');
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.checks.database).toBe('up');
      expect(res.body.checks.redis).toBe('up');
    },
    15_000,
  );
});
