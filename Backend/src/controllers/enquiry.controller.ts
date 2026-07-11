import { Request, Response } from 'express';
import { EnquiryService } from '../services/enquiry.service';
import { successResponse } from '../utils/http';

export class EnquiryController {
  static async create(req: Request, res: Response) {
    const enquiry = await EnquiryService.create(req.body, req.ip || req.socket.remoteAddress);
    successResponse(res, { message: 'Enquiry submitted successfully', id: enquiry.id }, 201);
  }
}
