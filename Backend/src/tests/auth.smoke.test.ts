import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';

const passwordHash = bcrypt.hashSync('password123', 4);

vi.mock('../config/database', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([1]),
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      create: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    auditLog: { create: vi.fn().mockResolvedValue({}) },
    device: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
  },
  connectDatabase: vi.fn(),
  disconnectDatabase: vi.fn(),
}));

vi.mock('../config/redis', () => ({
  getRedis: vi.fn().mockReturnValue(null),
  connectRedis: vi.fn(),
  disconnectRedis: vi.fn(),
}));

vi.mock('express-rate-limit', () => ({
  default: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('rate-limit-redis', () => ({
  default: class {},
}));

describe('Auth smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(
    'login sets refresh cookie and returns access token',
    async () => {
      const { prisma } = await import('../config/database');
      (prisma.user.findUnique as any).mockResolvedValue({
        id: '11111111-1111-1111-1111-111111111111',
        email: 'admin@test.com',
        name: 'Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
        passwordHash,
      });
      (prisma.user.update as any).mockResolvedValue({});
      (prisma.refreshToken.create as any).mockResolvedValue({});
      (prisma.auditLog.create as any).mockResolvedValue({});

      const { default: app } = await import('../app');
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeTruthy();
      const cookie = res.headers['set-cookie'];
      const cookieStr = Array.isArray(cookie) ? cookie.join(';') : String(cookie || '');
      expect(cookieStr).toContain('refresh_token=');
    },
    15_000,
  );

  it(
    'technician is forbidden from admin users list',
    async () => {
      const { prisma } = await import('../config/database');
      const { signAccessToken } = await import('../utils/jwt');
      const token = signAccessToken({
        sub: '11111111-1111-1111-1111-111111111111',
        email: 'tech@test.com',
        role: 'TECHNICIAN',
      });
      (prisma.user.findUnique as any).mockResolvedValue({
        id: '11111111-1111-1111-1111-111111111111',
        email: 'tech@test.com',
        name: 'Tech',
        role: 'TECHNICIAN',
        isActive: true,
      });

      const { default: app } = await import('../app');
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    },
    15_000,
  );

  it(
    'logout revokes refresh tokens for the user',
    async () => {
      const { prisma } = await import('../config/database');
      const { signAccessToken } = await import('../utils/jwt');
      const userId = '11111111-1111-1111-1111-111111111111';
      const token = signAccessToken({
        sub: userId,
        email: 'admin@test.com',
        role: 'SUPER_ADMIN',
      });
      (prisma.user.findUnique as any).mockResolvedValue({
        id: userId,
        email: 'admin@test.com',
        name: 'Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
      });
      (prisma.refreshToken.updateMany as any).mockResolvedValue({ count: 1 });
      (prisma.auditLog.create as any).mockResolvedValue({});

      const { default: app } = await import('../app');
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
    },
    15_000,
  );
});
