import type { AuthResponseData, AuthUser, LoginInput } from '@jcst/shared';

export interface RequestMetadata {
  ipAddress: string | null;
  userAgent: string | null;
}

export interface AuthSessionResult extends AuthResponseData {
  refreshToken: string;
}

export interface AuthServiceContract {
  login(input: LoginInput, metadata: RequestMetadata): Promise<AuthSessionResult>;
  refresh(refreshToken: string, metadata: RequestMetadata): Promise<AuthSessionResult>;
  logout(refreshToken: string | undefined): Promise<void>;
  getCurrentUser(userId: string): Promise<AuthUser>;
}
