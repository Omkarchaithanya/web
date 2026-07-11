import { z } from 'zod';

export const createZoneSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    city: z.string().default('Bengaluru'),
    beforeAqi: z.number().int(),
    afterAqi: z.number().int(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});

export const updateZoneSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    city: z.string().optional(),
    beforeAqi: z.number().int().optional(),
    afterAqi: z.number().int().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).strict(),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getZoneSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});
