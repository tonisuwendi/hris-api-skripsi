import { ApiError } from '@/utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: Record<string, string> | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation Error';
    errors = {};
    err.errors.forEach((e) => {
      const path = e.path;
      if (!path.length) return;
      const key = path
        .map((p) => (typeof p === 'number' ? `[${p}]` : `${p}`))
        .join('.');
      errors![key] = e.message;
    });
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Token tidak valid';
  } else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token telah kedaluwarsa';
  } else if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
