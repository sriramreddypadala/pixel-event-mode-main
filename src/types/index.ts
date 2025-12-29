export type MachineMode = 'NORMAL' | 'EVENT';

export type MachineState = 
  | 'IDLE'
  | 'ACTIVE_SESSION'
  | 'CAPTURING'
  | 'PAYMENT_PENDING'
  | 'PRINTING'
  | 'QR_DISPLAY'
  | 'THANK_YOU'
  | 'RESET';

export type PhotoLayout = {
  id: string;
  name: string;
  type: '2x2' | '3x3' | '4x4' | 'strip' | 'single';
  photoCount: number;
  stillCount: number;  // Number of photos to capture (1, 2, 4, 8)
  thumbnailUrl: string;
  price: number;
  visible: boolean;
  template: LayoutTemplate;
};

export type LayoutTemplate = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  photoShape: 'square' | 'circle' | 'rounded';
  photoSize: number;
  logoUrl?: string;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  fontFamily: string;
  textColor: string;
};

export type CapturedPhoto = {
  id: string;
  dataUrl: string;
  timestamp: number;
  frameNumber: number;
};

import type { GridTemplate } from './grid';

export type SessionData = {
  sessionId: string;
  layout: PhotoLayout | GridTemplate | null;
  copies: number;
  photos: CapturedPhoto[];
  mode: MachineMode;
  startTime: number;
  endTime?: number;
  printSettings?: {
    printAndCut: boolean;
  };
};

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export type PaymentData = {
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  timestamp: number;
};

export type PrintJob = {
  id: string;
  sessionId: string;
  layoutId: string;
  copies: number;
  status: 'QUEUED' | 'PRINTING' | 'COMPLETED' | 'FAILED';
  timestamp: number;
  mode: MachineMode;
};

export type PrintStats = {
  totalPrints: number;
  eventPrints: number;
  normalPrints: number;
  lastPrintTime?: number;
  paperRemaining: number;
};

export type MachineConfig = {
  machineId: string;
  mode: MachineMode;
  eventName?: string;
  eventMessage?: string;
  qrEnabled: boolean;
  openingVideoUrl?: string;
  promotionalImageUrl?: string;
  thankYouMessage: string;
  contactDetails: string;
  availableLayouts: PhotoLayout[];
  pricing: {
    basePrice: number;
    additionalCopyPrice: number;
  };
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR';
  avatar?: string;
};

export type Machine = {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  mode: MachineMode;
  location: string;
  lastSync: number;
  printStats: PrintStats;
  health: {
    paperLevel: number;
    inkLevel: number;
    temperature: number;
    errors: string[];
  };
};

export type AnalyticsData = {
  machineId: string;
  date: string;
  totalPrints: number;
  eventPrints: number;
  normalPrints: number;
  revenue: number;
};

export type QRCodeData = {
  sessionId: string;
  photos: string[];
  layoutPhoto: string;
  promotionalImage?: string;
  timestamp: number;
};
