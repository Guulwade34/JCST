import type { CookieOptions, Response } from 'express';
import { env } from '../config/env.js';
import { durationToMilliseconds } from './duration.js';

const refreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
  path: '/api/v1/auth',
  maxAge: durationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN),
  signed: true,
});

export const setRefreshCookie = (response: Response, refreshToken: string): void => {
  response.cookie(env.COOKIE_NAME, refreshToken, refreshCookieOptions());
};

export const clearRefreshCookie = (response: Response): void => {
  const options = refreshCookieOptions();
  Reflect.deleteProperty(options, 'maxAge');
  response.clearCookie(env.COOKIE_NAME, options);
};
