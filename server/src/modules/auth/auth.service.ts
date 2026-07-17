import { randomUUID } from 'node:crypto';
import { Types } from 'mongoose';
import type { AuthUser, LoginInput } from '@jcst/shared';
import { env } from '../../config/env.js';
import { verifyPassword } from '../../services/password.service.js';
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  verifyRefreshToken,
} from '../../services/token.service.js';
import { ApiError } from '../../utils/apiError.js';
import { durationToMilliseconds } from '../../utils/duration.js';
import { RefreshSessionModel } from '../sessions/refresh-session.model.js';
import { UserModel, type UserDocument } from '../users/user.model.js';
import type { AuthServiceContract, AuthSessionResult, RequestMetadata } from './auth.types.js';

const mapUser = (user: UserDocument): AuthUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  displayName: `${user.firstName} ${user.lastName}`.trim(),
  roles: user.roles,
  status: user.status,
  emailVerified: user.emailVerified,
  lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
});

export class AuthService implements AuthServiceContract {
  public async login(input: LoginInput, metadata: RequestMetadata): Promise<AuthSessionResult> {
    const email = input.email.trim().toLowerCase();
    const user = await UserModel.findOne({ email }).select(
      '+passwordHash +failedLoginAttempts +lockedUntil',
    );

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      throw new ApiError(423, 'Account is temporarily locked. Try again later.');
    }

    if (user.status !== 'active' || user.archivedAt) {
      throw new ApiError(403, 'This account is not active');
    }

    const passwordMatches = await verifyPassword(input.password, user.passwordHash);
    if (!passwordMatches) {
      await this.recordFailedLogin(user);
      throw new ApiError(401, 'Invalid email or password');
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    await user.save();

    return this.createSessionResult(user, metadata);
  }

  public async refresh(
    refreshToken: string,
    metadata: RequestMetadata,
  ): Promise<AuthSessionResult> {
    const payload = verifyRefreshToken(refreshToken);
    const currentSession = await RefreshSessionModel.findById(payload.sid).select('+tokenHash');
    const suppliedHash = hashToken(refreshToken);

    if (
      !currentSession ||
      currentSession.tokenHash !== suppliedHash ||
      currentSession.familyId !== payload.fid ||
      currentSession.userId.toString() !== payload.sub
    ) {
      if (currentSession) {
        await this.revokeFamily(currentSession.familyId, 'refresh-token-mismatch');
      }
      throw new ApiError(401, 'Refresh session is invalid');
    }

    if (currentSession.revokedAt) {
      await this.revokeFamily(currentSession.familyId, 'refresh-token-reuse-detected');
      throw new ApiError(401, 'Refresh session has already been used');
    }

    if (currentSession.expiresAt.getTime() <= Date.now()) {
      throw new ApiError(401, 'Refresh session has expired');
    }

    const user = await UserModel.findById(payload.sub);
    if (!user || user.status !== 'active' || user.archivedAt) {
      await this.revokeFamily(currentSession.familyId, 'user-inactive');
      throw new ApiError(401, 'User account is unavailable');
    }

    const newSessionId = new Types.ObjectId();
    const nextRefreshToken = createRefreshToken(
      user.id,
      newSessionId.toString(),
      currentSession.familyId,
    );

    await RefreshSessionModel.create({
      _id: newSessionId,
      userId: user._id,
      familyId: currentSession.familyId,
      tokenHash: hashToken(nextRefreshToken),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      expiresAt: new Date(Date.now() + durationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN)),
    });

    const rotation = await RefreshSessionModel.updateOne(
      {
        _id: currentSession._id,
        revokedAt: null,
        tokenHash: suppliedHash,
      },
      {
        $set: {
          revokedAt: new Date(),
          revokedReason: 'rotated',
          replacedBySessionId: newSessionId,
        },
      },
    );

    if (rotation.modifiedCount !== 1) {
      await RefreshSessionModel.deleteOne({ _id: newSessionId });
      await this.revokeFamily(currentSession.familyId, 'concurrent-refresh-detected');
      throw new ApiError(401, 'Refresh session could not be rotated');
    }

    return {
      user: mapUser(user),
      accessToken: createAccessToken(user.id, user.roles),
      refreshToken: nextRefreshToken,
    };
  }

  public async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      await RefreshSessionModel.updateOne(
        {
          _id: payload.sid,
          tokenHash: hashToken(refreshToken),
          revokedAt: null,
        },
        {
          $set: {
            revokedAt: new Date(),
            revokedReason: 'logout',
          },
        },
      );
    } catch {
      // Clearing the cookie remains safe and idempotent for malformed or expired tokens.
    }
  }

  public async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await UserModel.findById(userId);
    if (!user || user.status !== 'active' || user.archivedAt) {
      throw new ApiError(401, 'User account is unavailable');
    }
    return mapUser(user);
  }

  private async createSessionResult(
    user: UserDocument,
    metadata: RequestMetadata,
  ): Promise<AuthSessionResult> {
    const sessionId = new Types.ObjectId();
    const familyId = randomUUID();
    const refreshToken = createRefreshToken(user.id, sessionId.toString(), familyId);

    await RefreshSessionModel.create({
      _id: sessionId,
      userId: user._id,
      familyId,
      tokenHash: hashToken(refreshToken),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      expiresAt: new Date(Date.now() + durationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN)),
    });

    return {
      user: mapUser(user),
      accessToken: createAccessToken(user.id, user.roles),
      refreshToken,
    };
  }

  private async recordFailedLogin(user: UserDocument): Promise<void> {
    const attempts = user.failedLoginAttempts + 1;
    const lockAccount = attempts >= env.ACCOUNT_LOCK_MAX_ATTEMPTS;

    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          failedLoginAttempts: attempts,
          lockedUntil: lockAccount
            ? new Date(Date.now() + env.ACCOUNT_LOCK_MINUTES * 60_000)
            : null,
        },
      },
    );
  }

  private async revokeFamily(familyId: string, reason: string): Promise<void> {
    await RefreshSessionModel.updateMany(
      { familyId, revokedAt: null },
      { $set: { revokedAt: new Date(), revokedReason: reason } },
    );
  }
}
