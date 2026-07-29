import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { logger } from './logger';
import { isProduction } from '../config/env';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Resource not found' },
  });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code ?? 'APP_ERROR',
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.requestId,
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isProduction ? 'An unexpected error occurred' : err.message,
    },
  });
}

/** @deprecated Prefer middleware/validate.ts schema objects */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.query = schema.parse(req.query) as Request['query'];
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.params = schema.parse(req.params) as Request['params'];
    next();
  };
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

export function successResponse<T>(res: Response, data: T, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data });
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number },
): void {
  res.status(200).json({
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
}
