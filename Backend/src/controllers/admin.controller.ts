import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { successResponse } from '../utils/http';

export class AdminController {
  static async getAllUsers(req: Request, res: Response) {
    const users = await AdminService.getAllUsers();
    successResponse(res, users);
  }

  static async createUser(req: Request, res: Response) {
    const user = await AdminService.createUser(req.body);
    successResponse(res, user, 201);
  }

  static async updateUser(req: Request, res: Response) {
    const user = await AdminService.updateUser((req.params.id as string), req.body);
    successResponse(res, user);
  }

  static async getAuditLogs(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = await AdminService.getAuditLogs(limit);
    successResponse(res, logs);
  }
}
