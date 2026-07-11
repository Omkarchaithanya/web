import { z } from 'zod';
import { AlertType, AlertSeverity } from '@prisma/client';

export const createAlertSchema = z.object({
  body: z.object({
    type: z.nativeEnum(AlertType),
    severity: z.nativeEnum(AlertSeverity).optional(),
    deviceId: z.string().optional(),
    zoneId: z.string().uuid().optional(),
    message: z.string().min(5),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});

export const updateAlertSchema = z.object({
  body: z.object({
    isRead: z.boolean().optional(),
    resolved: z.boolean().optional(),
  }).strict(),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getAlertSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});
