import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry.controller';
import { validate } from '../middleware/validate';
import { createEnquirySchema } from '../validators/public.validator';
import { asyncHandler } from '../utils/http';
import { publicFormRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', publicFormRateLimiter, validate(createEnquirySchema), asyncHandler(EnquiryController.create));

export default router;
