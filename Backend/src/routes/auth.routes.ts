import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema, refreshSchema, logoutSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/http';
import { authRateLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', authRateLimiter, validate(loginSchema), asyncHandler(AuthController.login));
router.post('/refresh', validate(refreshSchema), asyncHandler(AuthController.refresh));
router.post('/logout', authenticate, validate(logoutSchema), asyncHandler(AuthController.logout));

export default router;
