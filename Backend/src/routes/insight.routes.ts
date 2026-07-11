import { Router } from 'express';
import { InsightController } from '../controllers/insight.controller';
import { validate } from '../middleware/validate';
import { createInsightSchema, getInsightSchema } from '../validators/insight.validator';
import { asyncHandler } from '../utils/http';
import { authenticate, authorizeAtLeast } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(InsightController.getAll));
router.get('/:id', validate(getInsightSchema), asyncHandler(InsightController.getById));
router.post('/', authorizeAtLeast('TECHNICIAN'), validate(createInsightSchema), asyncHandler(InsightController.create));
router.delete('/:id', authorizeAtLeast('SUPER_ADMIN'), validate(getInsightSchema), asyncHandler(InsightController.delete));

export default router;
