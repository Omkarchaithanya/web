import { z } from 'zod';
import { DeviceCommandType } from '@prisma/client';

export const createCommandSchema = z.object({
  body: z.object({
    deviceId: z.string().optional(),
    commandType: z.nativeEnum(DeviceCommandType),
    payload: z.record(z.any()).optional(),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});

export const getCommandSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});
