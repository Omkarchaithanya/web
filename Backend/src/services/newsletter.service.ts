import { prisma } from '../config/database';
import { AppError } from '../utils/http';

export class NewsletterService {
  static async subscribe(data: { email: string, source?: string }) {
    // Upsert so if they try to subscribe again it just succeeds or activates them
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: data.email },
      update: { isActive: true },
      create: { email: data.email, source: data.source || 'website' },
    });
    return subscriber;
  }
}
