import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export function paginationArgs(query: PaginationQuery) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}

/** Attach to route validators that already define body/params. */
export function withPaginationQuery<T extends z.ZodRawShape>(shape: T) {
  return z.object({
    body: z.object({}),
    query: paginationQuerySchema,
    params: z.object({}),
    ...shape,
  });
}

export const listPaginationSchema = z.object({
  body: z.object({}),
  query: paginationQuerySchema,
  params: z.object({}),
});
