import { Router } from 'express';
import { DeviceController } from '../controllers/device.controller';
import { validate } from '../middleware/validate';
import { createDeviceSchema, updateDeviceSchema, getDeviceSchema } from '../validators/device.validator';
import { asyncHandler } from '../utils/http';
import { authenticate, authorizeAtLeast } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /devices:
 *   get:
 *     summary: List devices (paginated)
 *     tags: [Devices]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 */
router.use(authenticate);

router.get('/', asyncHandler(DeviceController.getAll));
router.get('/:id', validate(getDeviceSchema), asyncHandler(DeviceController.getById));
router.post('/', authorizeAtLeast('GOVT_ADMIN'), validate(createDeviceSchema), asyncHandler(DeviceController.create));
router.patch('/:id', authorizeAtLeast('GOVT_ADMIN'), validate(updateDeviceSchema), asyncHandler(DeviceController.update));
router.delete('/:id', authorizeAtLeast('SUPER_ADMIN'), validate(getDeviceSchema), asyncHandler(DeviceController.delete));

export default router;
