import { Request, Response } from 'express';
import { DeviceService } from '../services/device.service';
import { successResponse } from '../utils/http';

export class DeviceController {
  static async getAll(req: Request, res: Response) {
    const devices = await DeviceService.getAll();
    successResponse(res, devices);
  }

  static async getById(req: Request, res: Response) {
    const device = await DeviceService.getById((req.params.id as string));
    successResponse(res, device);
  }

  static async create(req: Request, res: Response) {
    const device = await DeviceService.create(req.body);
    successResponse(res, device, 201);
  }

  static async update(req: Request, res: Response) {
    const device = await DeviceService.update((req.params.id as string), req.body);
    successResponse(res, device);
  }

  static async delete(req: Request, res: Response) {
    await DeviceService.delete((req.params.id as string));
    successResponse(res, { message: 'Device deleted successfully' });
  }
}
