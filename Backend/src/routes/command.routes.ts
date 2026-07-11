import { Router } from 'express';
import { CommandController } from '../controllers/command.controller';
import { validate } from '../middleware/validate';
import { createCommandSchema, getCommandSchema } from '../validators/command.validator';
import { asyncHandler } from '../utils/http';
import { authenticate, authorizeAtLeast } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(CommandController.getAll));
router.get('/:id', validate(getCommandSchema), asyncHandler(CommandController.getById));
// TECHNICIAN is the minimum level to issue commands, but the service enforces specific command type restrictions.
router.post('/', authorizeAtLeast('TECHNICIAN'), validate(createCommandSchema), asyncHandler(CommandController.create));

export default router;
