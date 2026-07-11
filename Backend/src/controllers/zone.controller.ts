import { Request, Response } from 'express';
import { ZoneService } from '../services/zone.service';
import { successResponse } from '../utils/http';

export class ZoneController {
  static async getAll(req: Request, res: Response) {
    const zones = await ZoneService.getAll();
    successResponse(res, zones);
  }

  static async getById(req: Request, res: Response) {
    const zone = await ZoneService.getById((req.params.id as string));
    successResponse(res, zone);
  }

  static async create(req: Request, res: Response) {
    const zone = await ZoneService.create(req.body);
    successResponse(res, zone, 201);
  }

  static async update(req: Request, res: Response) {
    const zone = await ZoneService.update((req.params.id as string), req.body);
    successResponse(res, zone);
  }

  static async delete(req: Request, res: Response) {
    await ZoneService.delete((req.params.id as string));
    successResponse(res, { message: 'Zone deleted successfully' });
  }
}
