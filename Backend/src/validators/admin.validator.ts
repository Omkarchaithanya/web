import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.nativeEnum(UserRole).default('TECHNICIAN'),
    region: z.string().default('ap-south-1'),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    name: z.string().min(2).optional(),
    role: z.nativeEnum(UserRole).optional(),
    isActive: z.boolean().optional(),
  }).strict(),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getUserSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().uuid(),
  }),
});
