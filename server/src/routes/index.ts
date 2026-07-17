import { Router, type RequestHandler } from 'express';
import { createAuthRouter } from '../modules/auth/auth.routes.js';
import { AuthService } from '../modules/auth/auth.service.js';
import type { AuthServiceContract } from '../modules/auth/auth.types.js';
import { healthRouter } from '../modules/health/health.routes.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  adminWebsiteRouter,
  publicWebsiteRouter,
} from '../modules/website/website-content.routes.js';
import { publicSubmissionRouter } from '../modules/public-submissions/public-submission.routes.js';

export interface ApiRouterDependencies {
  authService?: AuthServiceContract;
  authenticate?: RequestHandler;
}

export const createApiRouter = (dependencies: ApiRouterDependencies = {}): Router => {
  const router = Router();
  const authService = dependencies.authService ?? new AuthService();
  const authMiddleware = dependencies.authenticate ?? authenticate;

  router.use('/health', healthRouter);
  router.use('/auth', createAuthRouter({ authService, authenticate: authMiddleware }));
  router.use('/website', publicWebsiteRouter);
  router.use('/public', publicSubmissionRouter);
  router.use('/admin/website', adminWebsiteRouter);

  return router;
};
