import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { prisma } from '../config/database';
import * as jwtUtils from '../utils/jwt';

vi.mock('../config/database', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
    refreshToken: {
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
    },
    auditLog: { create: vi.fn() },
  },
}));

vi.mock('../utils/jwt', async () => {
  const actual = await vi.importActual<typeof import('../utils/jwt')>('../utils/jwt');
  return {
    ...actual,
    verifyRefreshToken: vi.fn(),
    signAccessToken: vi.fn(() => 'new-access-token'),
    signRefreshToken: vi.fn(() => 'new-refresh-token'),
    parseExpiresIn: vi.fn(() => new Date(Date.now() + 60_000)),
  };
});

describe('AuthService.refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects reuse and revokes all tokens for the user', async () => {
    (jwtUtils.verifyRefreshToken as any).mockReturnValue({
      sub: 'user-1',
      email: 'a@b.com',
      role: 'SUPER_ADMIN',
      type: 'refresh',
    });
    (prisma.refreshToken.findUnique as any).mockResolvedValue({
      id: 'token-123',
      token: 'old-token',
      userId: 'user-1',
      revokedAt: new Date(),
      expiresAt: new Date(Date.now() + 10_000),
      user: { id: 'user-1', isActive: true, email: 'a@b.com', role: 'SUPER_ADMIN' },
    });
    (prisma.refreshToken.updateMany as any).mockResolvedValue({ count: 1 });
    (prisma.auditLog.create as any).mockResolvedValue({});

    await expect(AuthService.refresh('old-token')).rejects.toThrow(
      'Token reuse detected. All sessions revoked.',
    );

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });

  it('refreshes token successfully if not revoked', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      role: 'SUPER_ADMIN',
      isActive: true,
    };
    (jwtUtils.verifyRefreshToken as any).mockReturnValue({
      sub: 'user-1',
      email: 'test@example.com',
      role: 'SUPER_ADMIN',
      type: 'refresh',
    });
    (prisma.refreshToken.findUnique as any).mockResolvedValue({
      id: 'token-123',
      token: 'valid-token',
      userId: 'user-1',
      revokedAt: null,
      expiresAt: new Date(Date.now() + 10_000),
      user: mockUser,
    });
    (prisma.refreshToken.update as any).mockResolvedValue({});
    (prisma.refreshToken.create as any).mockResolvedValue({ token: 'new-refresh-token' });

    const result = await AuthService.refresh('valid-token');
    expect(result).toHaveProperty('accessToken', 'new-access-token');
    expect(result).toHaveProperty('refreshToken', 'new-refresh-token');
  });
});
