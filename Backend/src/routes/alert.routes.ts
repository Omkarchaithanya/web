import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';
import { validate } from '../middleware/validate';
import { createAlertSchema, updateAlertSchema, getAlertSchema } from '../validators/alert.validator';
import { asyncHandler } from '../utils/http';
import { authenticate, authorizeAtLeast } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(AlertController.getAll));
router.get('/:id', validate(getAlertSchema), asyncHandler(AlertController.getById));
// Creation is usually internal, but expose for manual triggers/testing
router.post('/', authorizeAtLeast('TECHNICIAN'), validate(createAlertSchema), asyncHandler(AlertController.create));
router.patch('/:id', authorizeAtLeast('TECHNICIAN'), validate(updateAlertSchema), asyncHandler(AlertController.update));

export default router;
