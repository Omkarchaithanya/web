import { Request, Response } from 'express';
import { CommandService } from '../services/command.service';
import { paginatedResponse, successResponse } from '../utils/http';
import { paginationQuerySchema } from '../validators/pagination.validator';

export class CommandController {
  static async getAll(req: Request, res: Response) {
    const query = paginationQuerySchema.parse(req.query);
    const result = await CommandService.getAll(query);
    paginatedResponse(res, result.data, result.pagination);
  }

  static async getById(req: Request, res: Response) {
    const command = await CommandService.getById(req.params.id as string);
    successResponse(res, command);
  }

  static async create(req: Request, res: Response) {
    const command = await CommandService.create(req.body, req.user!.id, req.user!.role);
    successResponse(res, command, 201);
  }
}
