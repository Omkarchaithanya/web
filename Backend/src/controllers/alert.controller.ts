import { Request, Response } from 'express';
import { AlertService } from '../services/alert.service';
import { successResponse } from '../utils/http';

export class AlertController {
  static async getAll(req: Request, res: Response) {
    const isRead = req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined;
    const alerts = await AlertService.getAll(isRead);
    successResponse(res, alerts);
  }

  static async getById(req: Request, res: Response) {
    const alert = await AlertService.getById((req.params.id as string));
    successResponse(res, alert);
  }

  static async create(req: Request, res: Response) {
    const alert = await AlertService.create(req.body);
    successResponse(res, alert, 201);
  }

  static async update(req: Request, res: Response) {
    // req.user is guaranteed by authenticate middleware
    const alert = await AlertService.update((req.params.id as string), req.body, req.user!.id);
    successResponse(res, alert);
  }
}
