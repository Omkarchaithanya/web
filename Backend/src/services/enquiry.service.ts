import { prisma } from '../config/database';
import { AppError } from '../utils/http';
import { logger } from '../utils/logger';

export class EnquiryService {
  static async create(data: any, ipAddress?: string) {
    const enquiry = await prisma.enquiry.create({
      data: {
        ...data,
        ipAddress,
      },
    });

    // TODO: Trigger email notification if SMTP is configured
    logger.info(`New enquiry received from ${data.email}`);

    return enquiry;
  }
}
