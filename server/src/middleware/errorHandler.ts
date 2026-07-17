import type { ApiErrorDetail, ApiErrorResponse } from '@jcst/shared';
import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/apiError.js';

const isMongoDuplicateError = (
  value: unknown,
): value is { code: number } =>
  typeof value === 'object' &&
  value !== null &&
  'code' in value &&
  typeof (value as { code?: unknown }).code === 'number' &&
  (value as { code: number }).code === 11000;

const zodDetails = (error: ZodError): ApiErrorDetail[] =>
  error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _next,
) => {
  let statusCode = 500;
  let message = 'An unexpected server error occurred';
  let errors: ApiErrorDetail[] = [];

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Request validation failed';
    errors = zodDetails(error);
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Database validation failed';

    errors = Object.entries(error.errors).map(([path, item]) => ({
      path,
      message: item.message,
      code: item.name,
    }));
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid resource identifier';

    logger.warn(
      {
        requestId: request.requestId,
        method: request.method,
        url: request.originalUrl,
        errorName: error.name,
        errorMessage: error.message,
        path: error.path,
        value: error.value,
        stringValue: error.stringValue,
        kind: error.kind,
        stack: error.stack,
      },
      'MongoDB cast error',
    );

    if (env.NODE_ENV !== 'production') {
      errors.push({
        path: error.path,
        message: `Could not cast value ${error.stringValue} to ${error.kind}`,
        code: 'MONGOOSE_CAST_ERROR',
      });

      errors.push({
        message: error.message,
        code: 'DEBUG_MESSAGE',
      });

      if (error.stack) {
        errors.push({
          message: error.stack,
          code: 'DEBUG_STACK',
        });
      }
    }
  } else if (isMongoDuplicateError(error)) {
    statusCode = 409;
    message = 'A record with the same unique value already exists';
  }

  if (statusCode >= 500) {
    logger.error(
      {
        error,
        requestId: request.requestId,
        method: request.method,
        url: request.originalUrl,
      },
      'Unhandled request error',
    );

    if (env.NODE_ENV !== 'production' && error instanceof Error) {
      errors.push({
        message: error.message,
        code: 'DEBUG_MESSAGE',
      });

      errors.push({
        message: error.stack ?? error.message,
        code: 'DEBUG_STACK',
      });
    }
  }

  const payload: ApiErrorResponse = {
    success: false,
    message,
    errors,
    statusCode,
    requestId: request.requestId,
  };

  response.status(statusCode).json(payload);
};