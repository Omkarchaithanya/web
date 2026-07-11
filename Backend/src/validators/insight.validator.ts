import { z } from 'zod';

export const createInsightSchema = z.object({
  body: z.object({
    zoneId: z.string().uuid().optional(),
    deviceId: z.string().optional(),
    message: z.string().min(5),
    confidence: z.number().min(0).max(1),
    modelVersion: z.string(),
    expiresAt: z.string().datetime(),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});

export const getInsightSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});
