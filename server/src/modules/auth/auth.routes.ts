import { Router, type RequestHandler } from 'express';
import { loginRateLimiter } from '../../middleware/rateLimit.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createAuthController } from './auth.controller.js';
import type { AuthServiceContract } from './auth.types.js';
import { loginSchema } from './auth.validation.js';

interface AuthRouterDependencies {
  authService: AuthServiceContract;
  authenticate: RequestHandler;
}

export const createAuthRouter = ({ authService, authenticate }: AuthRouterDependencies): Router => {
  const router = Router();
  const controller = createAuthController(authService);

  router.post(
    '/login',
    loginRateLimiter,
    validateBody(loginSchema),
    asyncHandler(controller.login),
  );
  router.post('/refresh', asyncHandler(controller.refresh));
  router.post('/logout', asyncHandler(controller.logout));
  router.get('/me', authenticate, asyncHandler(controller.currentUser));

  return router;
};
