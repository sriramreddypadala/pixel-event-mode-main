/**
 * BOOTH SERVICE - Multi-booth API integration
 * Handles booth registration, config sync, and heartbeat
 */

import { apiService } from './api.service';
import type {
  BoothInfo,
  BoothRegistrationRequest,
  BoothRegistrationResponse,
  BoothConfig,
  ConfigUpdateRequest,
  ConfigUpdateResponse,
  BoothHeartbeat,
} from '@/types/booth.types';

class BoothService {
  /**
   * Register booth with backend
   */
  async registerBooth(
    request: BoothRegistrationRequest
  ): Promise<BoothRegistrationResponse> {
    const response = await apiService.post<BoothRegistrationResponse>(
      '/booths/register',
      request
    );
    return response.data!;
  }

  /**
   * Get booth information
   */
  async getBoothInfo(boothId: string): Promise<BoothInfo> {
    const response = await apiService.get<BoothInfo>(`/booths/${boothId}`);
    return response.data!;
  }

  /**
   * Get all booths (Admin only)
   */
  async getAllBooths(): Promise<BoothInfo[]> {
    const response = await apiService.get<BoothInfo[]>('/booths');
    return response.data!;
  }

  /**
   * Get booth configuration
   */
  async getBoothConfig(boothId: string): Promise<BoothConfig> {
    const response = await apiService.get<BoothConfig>(`/booths/${boothId}/config`);
    return response.data!;
  }

  /**
   * Update booth configuration (Admin)
   */
  async updateBoothConfig(
    request: ConfigUpdateRequest
  ): Promise<ConfigUpdateResponse> {
    const response = await apiService.put<ConfigUpdateResponse>(
      `/booths/${request.boothId}/config`,
      request
    );
    return response.data!;
  }

  /**
   * Send heartbeat (Machine)
   */
  async sendHeartbeat(heartbeat: BoothHeartbeat): Promise<void> {
    await apiService.post<void>('/booths/heartbeat', heartbeat);
  }

  /**
   * Check for pending config updates (Machine)
   */
  async checkPendingConfig(boothId: string): Promise<BoothConfig | null> {
    const response = await apiService.get<{ config: BoothConfig | null }>(
      `/booths/${boothId}/pending-config`
    );
    return response.data!.config;
  }
}

export const boothService = new BoothService();
