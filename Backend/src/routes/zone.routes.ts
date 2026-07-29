import { Router } from 'express';
import { ZoneController } from '../controllers/zone.controller';
import { validate } from '../middleware/validate';
import { createZoneSchema, updateZoneSchema, getZoneSchema } from '../validators/zone.validator';
import { asyncHandler } from '../utils/http';
import { authenticate, authorizeAtLeast } from '../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /zones:
 *   get:
 *     summary: List zones (paginated)
 *     tags: [Zones]
 *     responses:
 *       200:
 *         description: Paginated zone list
 * /zones/{id}:
 *   get:
 *     summary: Get zone by id
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *   patch:
 *     summary: Update zone
 *     tags: [Zones]
 *   delete:
 *     summary: Delete zone
 *     tags: [Zones]
 */
router.get('/', asyncHandler(ZoneController.getAll));
router.get('/:id', validate(getZoneSchema), asyncHandler(ZoneController.getById));
router.post('/', authorizeAtLeast('GOVT_ADMIN'), validate(createZoneSchema), asyncHandler(ZoneController.create));
router.patch('/:id', authorizeAtLeast('GOVT_ADMIN'), validate(updateZoneSchema), asyncHandler(ZoneController.update));
router.delete('/:id', authorizeAtLeast('SUPER_ADMIN'), validate(getZoneSchema), asyncHandler(ZoneController.delete));

export default router;
