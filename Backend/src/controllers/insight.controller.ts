import { Request, Response } from 'express';
import { InsightService } from '../services/insight.service';
import { paginatedResponse, successResponse } from '../utils/http';
import { paginationQuerySchema } from '../validators/pagination.validator';

export class InsightController {
  static async getAll(req: Request, res: Response) {
    const query = paginationQuerySchema.parse(req.query);
    const result = await InsightService.getAll(query);
    paginatedResponse(res, result.data, result.pagination);
  }

  static async getById(req: Request, res: Response) {
    const insight = await InsightService.getById(req.params.id as string);
    successResponse(res, insight);
  }

  static async create(req: Request, res: Response) {
    const insight = await InsightService.create(req.body);
    successResponse(res, insight, 201);
  }

  static async delete(req: Request, res: Response) {
    await InsightService.delete(req.params.id as string);
    successResponse(res, { message: 'Insight deleted successfully' });
  }
}
