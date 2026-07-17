import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';

const standardHandler = (
  _request: unknown,
  response: { status: (code: number) => { json: (body: unknown) => void } },
): void => {
  response.status(429).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: [],
    statusCode: 429,
  });
};

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: standardHandler,
});

export const loginRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: standardHandler,
});
