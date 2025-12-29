/**
 * ANALYTICS TYPES
 * Usage insights and operational metrics
 */

export interface AnalyticsSummary {
  totalPrints: number;
  eventPrints: number;
  normalPrints: number;
  activeBooths: number;
  totalBooths: number;
  todayPrints: number;
  weekPrints: number;
  monthPrints: number;
}

export interface PrintTrend {
  date: string;
  prints: number;
  eventPrints: number;
  normalPrints: number;
}

export interface BoothAnalytics {
  boothId: string;
  boothName: string;
  totalPrints: number;
  eventPrints: number;
  normalPrints: number;
  avgSessionTime: number;
  lastActive: string;
}

export interface ModeComparison {
  mode: 'normal' | 'event';
  prints: number;
  percentage: number;
}

export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}
