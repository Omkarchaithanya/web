import { Router } from 'express';
import { ZoneController } from '../controllers/zone.controller';
import { validate } from '../middleware/validate';
import { createZoneSchema, updateZoneSchema, getZoneSchema } from '../validators/zone.validator';
import { asyncHandler } from '../utils/http';
import { authenticate, authorizeAtLeast } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(ZoneController.getAll));
router.get('/:id', validate(getZoneSchema), asyncHandler(ZoneController.getById));
router.post('/', authorizeAtLeast('GOVT_ADMIN'), validate(createZoneSchema), asyncHandler(ZoneController.create));
router.patch('/:id', authorizeAtLeast('GOVT_ADMIN'), validate(updateZoneSchema), asyncHandler(ZoneController.update));
router.delete('/:id', authorizeAtLeast('SUPER_ADMIN'), validate(getZoneSchema), asyncHandler(ZoneController.delete));

export default router;
