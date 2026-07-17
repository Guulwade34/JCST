import type { Permission, UserRole } from '@jcst/shared';
import type { RequestHandler } from 'express';
import { ApiError } from '../utils/apiError.js';

export const requireRoles =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (request, _response, next) => {
    const auth = request.auth;
    if (!auth) {
      next(new ApiError(401, 'Authentication is required'));
      return;
    }

    if (
      !auth.roles.includes('super-admin') &&
      !auth.roles.some((role) => allowedRoles.includes(role))
    ) {
      next(new ApiError(403, 'You do not have access to this resource'));
      return;
    }
    next();
  };

export const requirePermissions =
  (...required: Permission[]): RequestHandler =>
  (request, _response, next) => {
    const auth = request.auth;
    if (!auth) {
      next(new ApiError(401, 'Authentication is required'));
      return;
    }

    if (
      !auth.roles.includes('super-admin') &&
      !required.every((permission) => auth.permissions.includes(permission))
    ) {
      next(new ApiError(403, 'Required permission is missing'));
      return;
    }
    next();
  };
