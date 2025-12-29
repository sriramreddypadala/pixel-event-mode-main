import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import type { GetAnalyticsRequest, GetAnalyticsResponse } from '@/types/api';

export const analyticsService = {
  async getAnalytics(params: GetAnalyticsRequest) {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      ...(params.machineId && { machineId: params.machineId }),
    });

    return apiService.get<GetAnalyticsResponse>(
      `${API_ENDPOINTS.ANALYTICS.GET}?${queryParams}`
    );
  },

  async exportAnalytics(params: GetAnalyticsRequest) {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      ...(params.machineId && { machineId: params.machineId }),
    });

    return apiService.get(
      `${API_ENDPOINTS.ANALYTICS.EXPORT}?${queryParams}`
    );
  },
};
