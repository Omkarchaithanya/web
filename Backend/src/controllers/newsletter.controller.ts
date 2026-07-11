import { Request, Response } from 'express';
import { NewsletterService } from '../services/newsletter.service';
import { successResponse } from '../utils/http';

export class NewsletterController {
  static async subscribe(req: Request, res: Response) {
    await NewsletterService.subscribe(req.body);
    successResponse(res, { message: 'Subscribed to newsletter successfully' }, 201);
  }
}
