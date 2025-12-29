/**
 * MULTI-BOOTH SYSTEM TYPES
 * Enterprise-grade booth identification and configuration
 */

export type BoothStatusType = 'online' | 'offline' | 'in-session' | 'error';
export type BoothMode = 'normal' | 'event';

/**
 * Booth Identity - Set once during installation
 */
export interface BoothIdentity {
  boothId: string;        // Unique, immutable identifier
  boothName: string;      // Human-readable name
  installDate: string;    // ISO timestamp
  hardwareId?: string;    // Optional hardware fingerprint
}

/**
 * Booth Configuration - Booth-specific settings
 */
export interface BoothConfig {
  boothId: string;
  mode: BoothMode;
  activeGridId: string;
  price: number;
  maxPrints?: number;
  theme: 'dark-premium';
  updatedAt: string;      // ISO timestamp
  updatedBy?: string;     // Admin user ID
}

/**
 * Session-Safe Configuration System
 * Prevents interruption of active sessions
 */
export interface BoothConfigState {
  activeConfig: BoothConfig;      // Currently applied config
  pendingConfig?: BoothConfig;    // Queued config (applied after session)
  hasPendingChanges: boolean;
}

/**
 * Booth Runtime Status
 */
export interface BoothRuntimeStatus {
  boothId: string;
  status: BoothStatusType;
  currentMode: BoothMode;
  activeGridId: string;
  isInSession: boolean;
  sessionStartTime?: string;
  lastHeartbeat: string;
  hasPendingConfig: boolean;
}

/**
 * Complete Booth Information (Admin View)
 */
export interface BoothInfo {
  identity: BoothIdentity;
  config: BoothConfig;
  status: BoothRuntimeStatus;
  stats?: {
    totalSessions: number;
    todaySessions: number;
    lastSessionTime?: string;
  };
}

/**
 * Booth Registration Request
 */
export interface BoothRegistrationRequest {
  boothId: string;
  boothName: string;
  hardwareId?: string;
  version: string;
}

/**
 * Booth Registration Response
 */
export interface BoothRegistrationResponse {
  success: boolean;
  booth: BoothInfo;
  config: BoothConfig;
  message?: string;
}

/**
 * Config Update Request (Admin → Booth)
 */
export interface ConfigUpdateRequest {
  boothId: string;
  config: Partial<BoothConfig>;
  immediate?: boolean;    // Force immediate update (admin override)
}

/**
 * Config Update Response
 */
export interface ConfigUpdateResponse {
  success: boolean;
  applied: boolean;       // true if applied immediately
  queued: boolean;        // true if queued for later
  message?: string;
}

/**
 * Booth Heartbeat (Machine → Backend)
 */
export interface BoothHeartbeat {
  boothId: string;
  status: BoothStatusType;
  isInSession: boolean;
  timestamp: string;
}
