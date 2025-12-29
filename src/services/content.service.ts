import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';
import type { ContentUpdateRequest, ContentUpdateResponse } from '@/types/api';

export const contentService = {
  async updateContent(data: ContentUpdateRequest) {
    return apiService.post<ContentUpdateResponse>(
      API_ENDPOINTS.CONTENT.UPDATE,
      data
    );
  },

  async uploadVideo(file: File, machineId: string) {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('machineId', machineId);

    return fetch(`${API_ENDPOINTS.CONTENT.UPLOAD_VIDEO}`, {
      method: 'POST',
      body: formData,
    });
  },

  async uploadImage(file: File, machineId: string) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('machineId', machineId);

    return fetch(`${API_ENDPOINTS.CONTENT.UPLOAD_IMAGE}`, {
      method: 'POST',
      body: formData,
    });
  },
};
