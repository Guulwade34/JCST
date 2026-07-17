import type { RequestHandler } from 'express';
import { ApiError } from '../utils/apiError.js';

const hasUnsafeMongoKey = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  if (Array.isArray(value)) {
    return value.some(hasUnsafeMongoKey);
  }

  return Object.entries(value as Record<string, unknown>).some(
    ([key, child]) => key.startsWith('$') || key.includes('.') || hasUnsafeMongoKey(child),
  );
};

export const rejectUnsafeMongoKeys: RequestHandler = (request, _response, next) => {
  if (hasUnsafeMongoKey(request.body) || hasUnsafeMongoKey(request.query)) {
    next(new ApiError(400, 'Request contains unsupported field names'));
    return;
  }
  next();
};
