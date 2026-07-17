import type { Permission, UserRole } from '@jcst/shared';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      auth?: {
        userId: string;
        roles: UserRole[];
        permissions: Permission[];
      };
    }
  }
}

export {};
