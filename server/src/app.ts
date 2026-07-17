import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { apiRateLimiter } from './middleware/rateLimit.js';
import { rejectUnsafeMongoKeys } from './middleware/sanitize.js';
import { requestContext } from './middleware/requestContext.js';
import { createApiRouter, type ApiRouterDependencies } from './routes/index.js';

export const createApp = (dependencies: ApiRouterDependencies = {}): Express => {
  const app = express();

  app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : false);
  app.disable('x-powered-by');

  app.use(requestContext);
  app.use(pinoHttp({ logger }));
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(rejectUnsafeMongoKeys);
  app.use('/api/v1', apiRateLimiter, createApiRouter(dependencies));
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
