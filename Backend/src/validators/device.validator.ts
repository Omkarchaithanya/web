import { z } from 'zod';
import { DeviceStatus, PowerSource } from '@prisma/client';

export const createDeviceSchema = z.object({
  body: z.object({
    id: z.string().min(3),
    zoneId: z.string().uuid(),
    location: z.string().min(2),
    status: z.nativeEnum(DeviceStatus).optional(),
    firmware: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    powerSource: z.nativeEnum(PowerSource).optional(),
    coverageRadius: z.number().int().optional(),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});

export const updateDeviceSchema = z.object({
  body: z.object({
    zoneId: z.string().uuid().optional(),
    location: z.string().min(2).optional(),
    status: z.nativeEnum(DeviceStatus).optional(),
    firmware: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    powerSource: z.nativeEnum(PowerSource).optional(),
    coverageRadius: z.number().int().optional(),
  }).strict(),
  query: z.object({}),
  params: z.object({
    id: z.string(),
  }),
});

export const getDeviceSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string(),
  }),
});
