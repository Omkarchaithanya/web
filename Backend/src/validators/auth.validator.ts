import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }).strict(),
  query: z.object({}),
  params: z.object({}),
});

export const refreshSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}),
  params: z.object({}),
  // Refresh token comes from httpOnly cookie
});

export const logoutSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}),
  params: z.object({}),
});
