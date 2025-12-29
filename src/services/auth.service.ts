import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import type { LoginRequest, LoginResponse } from '@/types/api';

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await apiService.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }

    return response;
  },

  async logout() {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    apiService.clearAuthToken();
    return response;
  },

  async refreshToken() {
    return apiService.post(API_ENDPOINTS.AUTH.REFRESH, {});
  },

  isAuthenticated(): boolean {
    return !!apiService.getAuthToken();
  },
};
