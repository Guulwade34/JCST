import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiSuccessResponse, AuthResponseData } from '@jcst/shared';
import { useAuthStore } from '@/store/authStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetryableRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<AuthResponseData> | null = null;

const refreshSession = async (): Promise<AuthResponseData> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiSuccessResponse<AuthResponseData>>('/auth/refresh')
      .then((response) => {
        useAuthStore.getState().setSession(response.data.data.accessToken, response.data.data.user);
        return response.data.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const isAuthenticationEndpoint = originalRequest?.url?.startsWith('/auth/') ?? false;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthenticationEndpoint
    ) {
      originalRequest._retry = true;
      try {
        const session = await refreshSession();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${session.accessToken}`,
        };
        return await apiClient.request(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearSession();
        throw refreshError instanceof Error ? refreshError : new Error('Session refresh failed');
      }
    }

    throw error;
  },
);
