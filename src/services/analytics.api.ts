/**
 * ANALYTICS API SERVICE
 * Backend integration for analytics and insights
 */

import { apiService } from './api.service';
import type {
  AnalyticsSummary,
  PrintTrend,
  BoothAnalytics,
  ModeComparison,
  AnalyticsDateRange,
} from '@/types/analytics.types';

class AnalyticsApiService {
  async fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
    const response = await apiService.get<AnalyticsSummary>('/analytics/summary');
    return response.data!;
  }

  async fetchPrintTrends(dateRange: AnalyticsDateRange): Promise<PrintTrend[]> {
    const response = await apiService.post<PrintTrend[]>('/analytics/trends', dateRange);
    return response.data!;
  }

  async fetchBoothAnalytics(dateRange: AnalyticsDateRange): Promise<BoothAnalytics[]> {
    const response = await apiService.post<BoothAnalytics[]>('/analytics/booths', dateRange);
    return response.data!;
  }

  async fetchModeComparison(dateRange: AnalyticsDateRange): Promise<ModeComparison[]> {
    const response = await apiService.post<ModeComparison[]>('/analytics/modes', dateRange);
    return response.data!;
  }
}

export const analyticsApiService = new AnalyticsApiService();
