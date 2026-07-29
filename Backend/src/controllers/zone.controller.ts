import { Request, Response } from 'express';
import { ZoneService } from '../services/zone.service';
import { paginatedResponse, successResponse } from '../utils/http';
import { paginationQuerySchema } from '../validators/pagination.validator';

export class ZoneController {
  static async getAll(req: Request, res: Response) {
    const query = paginationQuerySchema.parse(req.query);
    const result = await ZoneService.getAll(query);
    paginatedResponse(res, result.data, result.pagination);
  }

  static async getById(req: Request, res: Response) {
    const zone = await ZoneService.getById(req.params.id as string);
    successResponse(res, zone);
  }

  static async create(req: Request, res: Response) {
    const zone = await ZoneService.create(req.body);
    successResponse(res, zone, 201);
  }

  static async update(req: Request, res: Response) {
    const zone = await ZoneService.update(req.params.id as string, req.body);
    successResponse(res, zone);
  }

  static async delete(req: Request, res: Response) {
    await ZoneService.delete(req.params.id as string);
    successResponse(res, { message: 'Zone deleted successfully' });
  }
}
