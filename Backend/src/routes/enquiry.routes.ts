import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry.controller';
import { validate } from '../middleware/validate';
import { createEnquirySchema } from '../validators/public.validator';
import { asyncHandler } from '../utils/http';
import { publicFormRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @openapi
 * /enquiries:
 *   post:
 *     summary: Submit a public enquiry
 *     tags: [Enquiry]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               purpose:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enquiry stored
 */
router.post('/', publicFormRateLimiter, validate(createEnquirySchema), asyncHandler(EnquiryController.create));

export default router;
