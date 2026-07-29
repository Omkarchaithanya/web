import { Request, Response } from 'express';
import { AlertService } from '../services/alert.service';
import { paginatedResponse, successResponse } from '../utils/http';
import { paginationQuerySchema } from '../validators/pagination.validator';

export class AlertController {
  static async getAll(req: Request, res: Response) {
    const isRead =
      req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;
    const query = paginationQuerySchema.parse(req.query);
    const result = await AlertService.getAll(isRead, query);
    paginatedResponse(res, result.data, result.pagination);
  }

  static async getById(req: Request, res: Response) {
    const alert = await AlertService.getById(req.params.id as string);
    successResponse(res, alert);
  }

  static async create(req: Request, res: Response) {
    const alert = await AlertService.create(req.body);
    successResponse(res, alert, 201);
  }

  static async update(req: Request, res: Response) {
    const alert = await AlertService.update(req.params.id as string, req.body, req.user!.id);
    successResponse(res, alert);
  }
}
