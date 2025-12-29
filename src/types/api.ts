import { MachineMode, PhotoLayout, Machine, AnalyticsData, MachineConfig } from './index';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'OPERATOR';
  };
};

export type ModeUpdateRequest = {
  machineId: string;
  mode: MachineMode;
  eventName?: string;
  eventMessage?: string;
};

export type ModeUpdateResponse = {
  machineId: string;
  mode: MachineMode;
  syncedAt: number;
};

export type PrintCountSyncRequest = {
  machineId: string;
  totalPrints: number;
  eventPrints: number;
  normalPrints: number;
  timestamp: number;
};

export type PrintCountSyncResponse = {
  synced: boolean;
  serverPrintCount: number;
};

export type ContentUpdateRequest = {
  machineId: string;
  openingVideoUrl?: string;
  promotionalImageUrl?: string;
  thankYouMessage?: string;
  contactDetails?: string;
  qrEnabled?: boolean;
};

export type ContentUpdateResponse = {
  updated: boolean;
  timestamp: number;
};

export type LayoutUpdateRequest = {
  machineId: string;
  layouts: PhotoLayout[];
};

export type LayoutUpdateResponse = {
  updated: boolean;
  layouts: PhotoLayout[];
};

export type MachineStatusRequest = {
  machineId: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  health: {
    paperLevel: number;
    inkLevel: number;
    temperature: number;
    errors: string[];
  };
};

export type MachineStatusResponse = {
  acknowledged: boolean;
  timestamp: number;
};

export type GetMachinesResponse = {
  machines: Machine[];
};

export type GetAnalyticsRequest = {
  machineId?: string;
  startDate: string;
  endDate: string;
};

export type GetAnalyticsResponse = {
  analytics: AnalyticsData[];
  summary: {
    totalPrints: number;
    totalRevenue: number;
    averagePrintsPerDay: number;
  };
};

export type GetConfigResponse = {
  config: MachineConfig;
};

export type ResetEventCounterRequest = {
  machineId: string;
};

export type ResetEventCounterResponse = {
  reset: boolean;
  newEventCount: number;
};

// --- New Types for Backend Integration ---

export type SessionStartRequest = {
  machineId: string;
  timestamp: number;
};

export type SessionStartResponse = {
  sessionId: string;
  status: 'CREATED';
};

export type PaymentInitRequest = {
  sessionId: string;
  amount: number;
  method: 'CARD' | 'UPI';
  layoutId: string;
};

export type PaymentInitResponse = {
  transactionId: string;
  status: 'PENDING' | 'SUCCESS';
};

export type PhotoUploadResponse = {
  photoId: string;
  url: string;
};

export type PrintJobRequest = {
  sessionId: string;
  layoutId: string;
  photoIds: string[];
  copies: number;
};

export type PrintJobResponse = {
  jobId: string;
  status: 'QUEUED';
};

export type SessionFinalizeRequest = {
  sessionId: string;
};

export type SessionFinalizeResponse = {
  downloadUrl: string;
  compositeImageUrl: string;
};
