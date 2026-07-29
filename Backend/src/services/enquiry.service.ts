import nodemailer from 'nodemailer';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { logger } from '../utils/logger';

type EnquiryInput = {
  name: string;
  email: string;
  mobile?: string;
  purpose?: string;
  description?: string;
};

async function maybeSendEnquiryEmail(enquiry: EnquiryInput & { id: string }) {
  if (!env.SMTP_HOST || !env.ENQUIRY_NOTIFY_EMAIL) {
    logger.info('Enquiry stored; SMTP not configured — skipping email notify');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: false,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
  });

  await transporter.sendMail({
    from: env.SMTP_USER || env.ENQUIRY_NOTIFY_EMAIL,
    to: env.ENQUIRY_NOTIFY_EMAIL,
    subject: `UrbanTree enquiry from ${enquiry.name}`,
    text: [
      `Enquiry ID: ${enquiry.id}`,
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Mobile: ${enquiry.mobile || 'n/a'}`,
      `Purpose: ${enquiry.purpose || 'n/a'}`,
      '',
      enquiry.description || '',
    ].join('\n'),
  });
}

export class EnquiryService {
  static async create(data: EnquiryInput, ipAddress?: string) {
    const enquiry = await prisma.enquiry.create({
      data: {
        ...data,
        ipAddress,
      },
    });

    try {
      await maybeSendEnquiryEmail({
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        mobile: enquiry.mobile ?? undefined,
        purpose: enquiry.purpose ?? undefined,
        description: enquiry.description ?? undefined,
      });
    } catch (err) {
      logger.error('Failed to send enquiry notification email', err);
    }

    logger.info(`New enquiry received from ${data.email}`);
    return enquiry;
  }
}
