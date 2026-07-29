import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { paginatedResponse, successResponse } from '../utils/http';
import { paginationQuerySchema } from '../validators/pagination.validator';

export class AdminController {
  static async getAllUsers(req: Request, res: Response) {
    const query = paginationQuerySchema.parse(req.query);
    const result = await AdminService.getAllUsers(query);
    paginatedResponse(res, result.data, result.pagination);
  }

  static async createUser(req: Request, res: Response) {
    const user = await AdminService.createUser(req.body);
    successResponse(res, user, 201);
  }

  static async updateUser(req: Request, res: Response) {
    const user = await AdminService.updateUser(req.params.id as string, req.body);
    successResponse(res, user);
  }

  static async getAuditLogs(req: Request, res: Response) {
    const query = paginationQuerySchema.parse(req.query);
    const result = await AdminService.getAuditLogs(query);
    paginatedResponse(res, result.data, result.pagination);
  }
}
