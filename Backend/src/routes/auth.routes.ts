import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema, refreshSchema, logoutSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/http';
import { authRateLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Access token + user; refresh cookie set
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
 * /auth/logout:
 *   post:
 *     summary: Logout and revoke refresh token
 *     tags: [Auth]
 */
router.post('/login', authRateLimiter, validate(loginSchema), asyncHandler(AuthController.login));
router.post('/refresh', authRateLimiter, validate(refreshSchema), asyncHandler(AuthController.refresh));
router.post('/logout', authenticate, validate(logoutSchema), asyncHandler(AuthController.logout));

export default router;
