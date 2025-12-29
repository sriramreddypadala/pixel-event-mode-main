/**
 * ANALYTICS STORE
 * State management for analytics and insights
 */

import { create } from 'zustand';
import type {
  AnalyticsSummary,
  PrintTrend,
  BoothAnalytics,
  ModeComparison,
  AnalyticsDateRange,
} from '@/types/analytics.types';

interface AnalyticsStore {
  summary: AnalyticsSummary | null;
  printTrends: PrintTrend[];
  boothAnalytics: BoothAnalytics[];
  modeComparison: ModeComparison[];
  dateRange: AnalyticsDateRange;
  loading: boolean;
  error: string | null;
  
  // Actions
  setSummary: (summary: AnalyticsSummary) => void;
  setPrintTrends: (trends: PrintTrend[]) => void;
  setBoothAnalytics: (analytics: BoothAnalytics[]) => void;
  setModeComparison: (comparison: ModeComparison[]) => void;
  setDateRange: (range: AnalyticsDateRange) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultDateRange: AnalyticsDateRange = {
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date().toISOString(),
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  summary: null,
  printTrends: [],
  boothAnalytics: [],
  modeComparison: [],
  dateRange: defaultDateRange,
  loading: false,
  error: null,
  
  setSummary: (summary) => set({ summary }),
  setPrintTrends: (trends) => set({ printTrends: trends }),
  setBoothAnalytics: (analytics) => set({ boothAnalytics: analytics }),
  setModeComparison: (comparison) => set({ modeComparison: comparison }),
  setDateRange: (range) => set({ dateRange: range }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    summary: null,
    printTrends: [],
    boothAnalytics: [],
    modeComparison: [],
    dateRange: defaultDateRange,
    loading: false,
    error: null,
  }),
}));
