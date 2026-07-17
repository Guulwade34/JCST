import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../services/token.service.js';
import { ApiError } from '../utils/apiError.js';
import { UserModel } from '../modules/users/user.model.js';

export const authenticate: RequestHandler = async (request, _response, next) => {
  try {
    const authorization = request.header('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication is required');
    }

    const token = authorization.slice('Bearer '.length).trim();
    const payload = verifyAccessToken(token);
    const user = await UserModel.findById(payload.sub).select(
      'roles permissions status archivedAt',
    );

    if (!user || user.status !== 'active' || user.archivedAt) {
      throw new ApiError(401, 'User account is unavailable');
    }

    request.auth = {
      userId: user.id,
      roles: user.roles,
      permissions: user.permissions,
    };
    next();
  } catch (error) {
    next(error);
  }
};
