import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema, getUserSchema } from '../validators/admin.validator';
import { asyncHandler } from '../utils/http';
import { authenticate, authorizeAtLeast } from '../middleware/auth';

const router = Router();

router.use(authenticate);
// Admin routes require SUPER_ADMIN
router.use(authorizeAtLeast('SUPER_ADMIN'));

router.get('/users', asyncHandler(AdminController.getAllUsers));
router.post('/users', validate(createUserSchema), asyncHandler(AdminController.createUser));
router.patch('/users/:id', validate(updateUserSchema), asyncHandler(AdminController.updateUser));

router.get('/audit-logs', asyncHandler(AdminController.getAuditLogs));

export default router;
