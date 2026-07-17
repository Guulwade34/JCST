import type { LoginInput } from '@jcst/shared';
import type { Request, Response } from 'express';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { clearRefreshCookie, setRefreshCookie } from '../../utils/cookies.js';
import type { AuthServiceContract, RequestMetadata } from './auth.types.js';

const getMetadata = (request: Request): RequestMetadata => ({
  ipAddress: request.ip ?? null,
  userAgent: request.header('user-agent')?.slice(0, 512) ?? null,
});

const readRefreshCookie = (request: Request): string | undefined => {
  const signedCookies = request.signedCookies as Record<string, unknown> | undefined;
  const value = signedCookies?.[env.COOKIE_NAME];
  return typeof value === 'string' ? value : undefined;
};

export const createAuthController = (authService: AuthServiceContract) => ({
  login: async (request: Request, response: Response): Promise<void> => {
    const result = await authService.login(request.body as LoginInput, getMetadata(request));
    setRefreshCookie(response, result.refreshToken);
    sendSuccess(response, 200, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken,
    });
  },

  refresh: async (request: Request, response: Response): Promise<void> => {
    const refreshToken = readRefreshCookie(request);
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token is missing');
    }

    const result = await authService.refresh(refreshToken, getMetadata(request));
    setRefreshCookie(response, result.refreshToken);
    sendSuccess(response, 200, 'Session refreshed', {
      user: result.user,
      accessToken: result.accessToken,
    });
  },

  logout: async (request: Request, response: Response): Promise<void> => {
    await authService.logout(readRefreshCookie(request));
    clearRefreshCookie(response);
    sendSuccess(response, 200, 'Logout successful', {});
  },

  currentUser: async (request: Request, response: Response): Promise<void> => {
    if (!request.auth) {
      throw new ApiError(401, 'Authentication is required');
    }
    const user = await authService.getCurrentUser(request.auth.userId);
    sendSuccess(response, 200, 'Current user retrieved', { user });
  },
});
