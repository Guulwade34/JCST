import type {
  ApiSuccessResponse,
  AuthResponseData,
  CurrentUserResponseData,
  LoginInput,
} from '@jcst/shared';
import { apiClient } from '@/services/apiClient';
import {
  clearSessionHint,
  markSessionPresent,
} from '@/features/auth/sessionHint';

export const authApi = {
  async login(input: LoginInput): Promise<AuthResponseData> {
    const response = await apiClient.post<
      ApiSuccessResponse<AuthResponseData>
    >('/auth/login', input);

    markSessionPresent();

    return response.data.data;
  },

  async refresh(): Promise<AuthResponseData> {
    try {
      const response = await apiClient.post<
        ApiSuccessResponse<AuthResponseData>
      >('/auth/refresh');

      markSessionPresent();

      return response.data.data;
    } catch (error) {
      clearSessionHint();
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearSessionHint();
    }
  },

  async currentUser(): Promise<CurrentUserResponseData> {
    const response = await apiClient.get<
      ApiSuccessResponse<CurrentUserResponseData>
    >('/auth/me');

    return response.data.data;
  },
};