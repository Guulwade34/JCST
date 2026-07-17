import { Router } from 'express';
import { env } from '../../config/env.js';
import { getDatabaseStatus } from '../../config/database.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  const database = getDatabaseStatus();
  const healthy = database === 'connected';

  sendSuccess(
    response,
    healthy ? 200 : 503,
    healthy ? 'Service is healthy' : 'Service is degraded',
    {
      status: healthy ? 'ok' : 'degraded',
      database,
      serverTime: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: env.APP_VERSION,
    },
  );
});
