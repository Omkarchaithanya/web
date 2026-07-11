import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import { signAccessToken, signRefreshToken, verifyRefreshToken, parseExpiresIn } from '../utils/jwt';
import { env } from '../config/env';
import bcrypt from 'bcryptjs';

export class AuthService {
  static async login(email: string, passwordPlain: string, userAgent?: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid credentials or inactive account', 'UNAUTHORIZED');
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials', 'UNAUTHORIZED');
    }

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshTokenStr = signRefreshToken({ sub: user.id, email: user.email, role: user.role });

    const expiresAt = parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN);

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenStr,
        userId: user.id,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        resource: 'AUTH',
        ipAddress,
        userAgent,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenStr,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async refresh(oldRefreshToken: string, userAgent?: string, ipAddress?: string) {
    // 1. Verify token signature
    verifyRefreshToken(oldRefreshToken);

    // 2. Find in DB
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new AppError(401, 'Invalid refresh token', 'UNAUTHORIZED');
    }

    // 3. Reuse detection (theft scenario)
    if (tokenRecord.revokedAt) {
      // Token was already used/revoked. We must revoke ALL tokens for this user.
      await prisma.refreshToken.updateMany({
        where: { userId: tokenRecord.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      
      await prisma.auditLog.create({
        data: {
          userId: tokenRecord.userId,
          action: 'TOKEN_THEFT_DETECTED',
          resource: 'AUTH',
          metadata: { revokedToken: oldRefreshToken },
        }
      });

      throw new AppError(401, 'Token reuse detected. All sessions revoked.', 'UNAUTHORIZED');
    }

    // 4. Check expiration (just in case db lags behind jwt verify)
    if (tokenRecord.expiresAt < new Date()) {
      throw new AppError(401, 'Refresh token expired', 'UNAUTHORIZED');
    }

    if (!tokenRecord.user.isActive) {
      throw new AppError(401, 'Account inactive', 'UNAUTHORIZED');
    }

    // 5. Revoke old token
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    // 6. Issue new tokens
    const accessToken = signAccessToken({ sub: tokenRecord.user.id, email: tokenRecord.user.email, role: tokenRecord.user.role });
    const newRefreshToken = signRefreshToken({ sub: tokenRecord.user.id, email: tokenRecord.user.email, role: tokenRecord.user.role });

    const expiresAt = parseExpiresIn(env.JWT_REFRESH_EXPIRES_IN);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: tokenRecord.user.id,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(refreshToken: string, userId: string, userAgent?: string, ipAddress?: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, userId },
      data: { revokedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'LOGOUT',
        resource: 'AUTH',
        ipAddress,
        userAgent,
      },
    });
  }
}
