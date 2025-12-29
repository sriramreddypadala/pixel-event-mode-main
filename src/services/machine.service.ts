import { apiService } from './api.service';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api.config';
import type {
  ModeUpdateRequest,
  ModeUpdateResponse,
  PrintCountSyncRequest,
  PrintCountSyncResponse,
  MachineStatusRequest,
  MachineStatusResponse,
  GetConfigResponse,
  SessionStartRequest,
  SessionStartResponse,
  PaymentInitRequest,
  PaymentInitResponse,
  PhotoUploadResponse,
  PrintJobRequest,
  PrintJobResponse,
  SessionFinalizeRequest,
  SessionFinalizeResponse,
} from '@/types/api';

export const machineService = {
  async getConfig() {
    return apiService.get<GetConfigResponse>(
      `${API_ENDPOINTS.MACHINE.GET_CONFIG}/${API_CONFIG.MACHINE_ID}`
    );
  },

  async updateMode(data: ModeUpdateRequest) {
    return apiService.post<ModeUpdateResponse>(
      API_ENDPOINTS.MACHINE.UPDATE_MODE,
      data
    );
  },

  async syncPrintCount(data: PrintCountSyncRequest) {
    return apiService.post<PrintCountSyncResponse>(
      API_ENDPOINTS.MACHINE.SYNC_PRINT_COUNT,
      data
    );
  },

  async updateStatus(data: MachineStatusRequest) {
    return apiService.post<MachineStatusResponse>(
      API_ENDPOINTS.MACHINE.UPDATE_STATUS,
      data
    );
  },

  async getMachines() {
    return apiService.get(API_ENDPOINTS.MACHINE.GET_MACHINES);
  },

  // --- New Methods for Backend Integration ---

  async startSession(data: SessionStartRequest) {
    return apiService.post<SessionStartResponse>(
      API_ENDPOINTS.MACHINE.SESSION_START,
      data
    );
  },

  async initiatePayment(data: PaymentInitRequest) {
    return apiService.post<PaymentInitResponse>(
      API_ENDPOINTS.MACHINE.PAYMENT_INIT,
      data
    );
  },

  async uploadPhoto(file: Blob, sessionId: string, frameIndex: number) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);
    formData.append('frameIndex', frameIndex.toString());

    return apiService.post<PhotoUploadResponse>(
      API_ENDPOINTS.MACHINE.PHOTO_UPLOAD,
      formData
    );
  },

  async submitPrintJob(data: PrintJobRequest) {
    return apiService.post<PrintJobResponse>(
      API_ENDPOINTS.MACHINE.PRINT_JOB,
      data
    );
  },

  async finalizeSession(data: SessionFinalizeRequest) {
    return apiService.post<SessionFinalizeResponse>(
      API_ENDPOINTS.MACHINE.SESSION_FINALIZE,
      data
    );
  },
};
