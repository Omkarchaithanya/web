import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, AppError } from '../utils/http';
import { env } from '../config/env';

const COOKIE_NAME = 'refresh_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: `${env.API_PREFIX}/auth`,
};

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await AuthService.login(
      email,
      password,
      req.headers['user-agent'],
      req.ip || req.socket.remoteAddress
    );

    res.cookie(COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);

    successResponse(res, {
      accessToken: result.accessToken,
      user: result.user,
    });
  }

  static async refresh(req: Request, res: Response) {
    const oldRefreshToken = req.cookies[COOKIE_NAME];
    if (!oldRefreshToken) {
      throw new AppError(401, 'No refresh token provided', 'UNAUTHORIZED');
    }

    const result = await AuthService.refresh(
      oldRefreshToken,
      req.headers['user-agent'],
      req.ip || req.socket.remoteAddress
    );

    res.cookie(COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);

    successResponse(res, {
      accessToken: result.accessToken,
    });
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies[COOKIE_NAME] as string | undefined;
    if (!req.user) {
      throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
    }

    if (refreshToken) {
      await AuthService.logout(
        refreshToken,
        req.user.id,
        req.headers['user-agent'],
        req.ip || req.socket.remoteAddress
      );
    } else {
      await AuthService.logoutAllSessions(
        req.user.id,
        req.headers['user-agent'],
        req.ip || req.socket.remoteAddress
      );
    }

    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    successResponse(res, { message: 'Logged out successfully' });
  }
}
