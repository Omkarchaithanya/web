import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { env } from '../config/env';
import { JwtPayload } from '../types';
import { AppError } from '../utils/http';

export function signAccessToken(payload: Omit<JwtPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'urbantree-api',
    audience: 'urbantree-client',
  });
}

export function signRefreshToken(payload: Omit<JwtPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'urbantree-api',
    audience: 'urbantree-client',
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: 'urbantree-api',
      audience: 'urbantree-client',
    }) as JwtPayload;

    if (decoded.type !== 'access') {
      throw new AppError(401, 'Invalid token type', 'INVALID_TOKEN');
    }
    return decoded;
  } catch {
    throw new AppError(401, 'Invalid or expired access token', 'INVALID_TOKEN');
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: 'urbantree-api',
      audience: 'urbantree-client',
    }) as JwtPayload;

    if (decoded.type !== 'refresh') {
      throw new AppError(401, 'Invalid token type', 'INVALID_TOKEN');
    }
    return decoded;
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token', 'INVALID_TOKEN');
  }
}

export function parseExpiresIn(expiresIn: string): Date {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + value * multipliers[unit]);
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  TECHNICIAN: 1,
  GOVT_ADMIN: 2,
  SUPER_ADMIN: 3,
};
