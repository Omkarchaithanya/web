import { AuthService } from '../services/auth.service';
import { prisma } from '../config/database';
import jwt from 'jsonwebtoken';

jest.mock('../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    refreshToken: {
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    }
  },
}));

jest.mock('../config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    JWT_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
  },
}));

jest.mock('jsonwebtoken');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshToken', () => {
    it('should detect reuse and revoke all tokens for the user', async () => {
      const mockToken = {
        id: 'token-123',
        token: 'old-token',
        userId: 'user-1',
        revokedAt: new Date(), // Already revoked
        expiresAt: new Date(Date.now() + 10000),
      };

      (jwt.verify as jest.Mock).mockReturnValue({ id: 'user-1', type: 'refresh' });
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(mockToken);
      (prisma.refreshToken.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      await expect(AuthService.refresh('old-token')).rejects.toThrow('Token reuse detected. All sessions revoked.');
      
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', revokedAt: null },
        data: { revokedAt: expect.any(Date) }
      });
    });

    it('should refresh token successfully if not revoked', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'SUPER_ADMIN',
        isActive: true,
      };
      const mockToken = {
        id: 'token-123',
        token: 'valid-token',
        userId: 'user-1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 10000),
        user: mockUser,
      };

      (jwt.verify as jest.Mock).mockReturnValue({ id: 'user-1', type: 'refresh' });
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(mockToken);
      (prisma.refreshToken.update as jest.Mock).mockResolvedValue({});
      (prisma.refreshToken.create as jest.Mock).mockResolvedValue({ token: 'new-refresh-token' });
      (jwt.sign as jest.Mock).mockReturnValue('new-access-token');

      const result = await AuthService.refresh('valid-token');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
