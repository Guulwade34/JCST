import type { UserRole } from '../constants/roles.js';

export const USER_STATUSES = ['pending', 'active', 'suspended', 'archived'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  roles: UserRole[];
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: AuthUser;
  accessToken: string;
}

export interface CurrentUserResponseData {
  user: AuthUser;
}
