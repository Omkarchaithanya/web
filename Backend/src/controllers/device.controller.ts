import { Request, Response } from 'express';
import { DeviceService } from '../services/device.service';
import { paginatedResponse, successResponse } from '../utils/http';
import { paginationQuerySchema } from '../validators/pagination.validator';

export class DeviceController {
  static async getAll(req: Request, res: Response) {
    const query = paginationQuerySchema.parse(req.query);
    const result = await DeviceService.getAll(query);
    paginatedResponse(res, result.data, result.pagination);
  }

  static async getById(req: Request, res: Response) {
    const device = await DeviceService.getById(req.params.id as string);
    successResponse(res, device);
  }

  static async create(req: Request, res: Response) {
    const device = await DeviceService.create(req.body);
    successResponse(res, device, 201);
  }

  static async update(req: Request, res: Response) {
    const device = await DeviceService.update(req.params.id as string, req.body);
    successResponse(res, device);
  }

  static async delete(req: Request, res: Response) {
    await DeviceService.delete(req.params.id as string);
    successResponse(res, { message: 'Device deleted successfully' });
  }
}
