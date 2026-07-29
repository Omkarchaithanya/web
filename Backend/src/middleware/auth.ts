import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { env } from '../config/env';
import crypto from 'crypto';
import { verifyAccessToken, ROLE_HIERARCHY } from '../utils/jwt';
import { AppError } from '../utils/http';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
    }

    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, name: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new AppError(401, 'Account inactive or not found', 'UNAUTHORIZED');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/** Unused — prefer explicit `authenticate` on protected routes. Kept for optional public+user endpoints. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  authenticate(req, _res, next).catch(next);
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(403, 'Insufficient permissions', 'FORBIDDEN');
    }
    next();
  };
}

export function authorizeAtLeast(minimumRole: UserRole) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
    }
    const userLevel = ROLE_HIERARCHY[req.user.role];
    const requiredLevel = ROLE_HIERARCHY[minimumRole];
    
    if (userLevel < requiredLevel) {
      throw new AppError(403, 'Insufficient permissions', 'FORBIDDEN');
    }
    next();
  };
}

export function iotApiKeyAuth(req: Request, _res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey || typeof apiKey !== 'string') {
    throw new AppError(401, 'Invalid IoT API key', 'INVALID_API_KEY');
  }

  const expectedKey = env.IOT_API_KEY || '';
  const keyBuffer = Buffer.from(apiKey);
  const envKeyBuffer = Buffer.from(expectedKey);

  if (
    keyBuffer.length !== envKeyBuffer.length ||
    !crypto.timingSafeEqual(keyBuffer, envKeyBuffer)
  ) {
    throw new AppError(401, 'Invalid IoT API key', 'INVALID_API_KEY');
  }
  next();
}
