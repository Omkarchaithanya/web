import { Request, Response } from 'express';
import { CommandService } from '../services/command.service';
import { successResponse } from '../utils/http';

export class CommandController {
  static async getAll(req: Request, res: Response) {
    const commands = await CommandService.getAll();
    successResponse(res, commands);
  }

  static async getById(req: Request, res: Response) {
    const command = await CommandService.getById((req.params.id as string));
    successResponse(res, command);
  }

  static async create(req: Request, res: Response) {
    const command = await CommandService.create(req.body, req.user!.id, req.user!.role);
    successResponse(res, command, 201);
  }
}
