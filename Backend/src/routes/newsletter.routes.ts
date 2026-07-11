import { Router } from 'express';
import { NewsletterController } from '../controllers/newsletter.controller';
import { validate } from '../middleware/validate';
import { subscribeNewsletterSchema } from '../validators/public.validator';
import { asyncHandler } from '../utils/http';
import { publicFormRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', publicFormRateLimiter, validate(subscribeNewsletterSchema), asyncHandler(NewsletterController.subscribe));

export default router;
