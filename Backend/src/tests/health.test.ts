import request from 'supertest';
import app from '../app';


jest.mock('../config/env', () => ({
  env: {
    NODE_ENV: 'test',
    API_PREFIX: '/api/v1',
  },
  corsOrigins: ['*'],
}));

jest.mock('../config/database', () => ({
  prisma: {
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
  },
}));

jest.mock('express-rate-limit', () => {
  return () => (req: any, res: any, next: any) => next();
});

jest.mock('../config/redis', () => ({
  getRedis: jest.fn().mockReturnValue({
    ping: jest.fn().mockResolvedValue('PONG'),
    call: jest.fn().mockResolvedValue(null),
  }),
}));

describe('Health API', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
