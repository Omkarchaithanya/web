import { z } from 'zod';

export const createEnquirySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    mobile: z.string().optional(),
    purpose: z.string().optional(),
    description: z.string().optional(),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});

export const subscribeNewsletterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    source: z.string().default('website'),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});
