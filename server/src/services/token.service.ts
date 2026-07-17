import { createHash, randomUUID } from 'node:crypto';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import type { UserRole } from '@jcst/shared';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

const issuer = 'jcst-platform';
const audience = 'jcst-web-client';

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  type: 'access';
  roles: UserRole[];
}

export interface RefreshTokenPayload extends JwtPayload {
  sub: string;
  type: 'refresh';
  sid: string;
  fid: string;
  jti: string;
}

export const createAccessToken = (userId: string, roles: UserRole[]): string =>
  jwt.sign(
    { sub: userId, type: 'access', roles } satisfies Omit<AccessTokenPayload, keyof JwtPayload>,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
      issuer,
      audience,
    },
  );

export const createRefreshToken = (userId: string, sessionId: string, familyId: string): string =>
  jwt.sign(
    {
      sub: userId,
      type: 'refresh',
      sid: sessionId,
      fid: familyId,
      jti: randomUUID(),
    } satisfies Omit<RefreshTokenPayload, keyof JwtPayload>,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
      issuer,
      audience,
    },
  );

const verifyTypedToken = <T extends JwtPayload>(token: string, secret: string): T => {
  try {
    const decoded = jwt.verify(token, secret, { issuer, audience });
    if (typeof decoded === 'string') {
      throw new ApiError(401, 'Invalid authentication token');
    }
    return decoded as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Authentication token is invalid or expired');
  }
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = verifyTypedToken<AccessTokenPayload>(token, env.JWT_ACCESS_SECRET);
  if (payload.type !== 'access' || !payload.sub) {
    throw new ApiError(401, 'Invalid access token');
  }
  return payload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const payload = verifyTypedToken<RefreshTokenPayload>(token, env.JWT_REFRESH_SECRET);
  if (payload.type !== 'refresh' || !payload.sub || !payload.sid || !payload.fid || !payload.jti) {
    throw new ApiError(401, 'Invalid refresh token');
  }
  return payload;
};

export const hashToken = (token: string): string =>
  createHash('sha256').update(token, 'utf8').digest('hex');
