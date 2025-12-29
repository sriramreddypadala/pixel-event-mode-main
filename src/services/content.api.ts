/**
 * CONTENT API SERVICE
 * Backend integration for content management
 */

import { apiService } from './api.service';
import type {
  ContentListResponse,
  AssignContentRequest,
  ToggleContentStatusRequest,
} from '@/types/content.types';

class ContentApiService {
  async fetchContentList(): Promise<ContentListResponse> {
    const response = await apiService.get<ContentListResponse>('/content');
    return response.data!;
  }

  async assignContentToBooth(request: AssignContentRequest): Promise<void> {
    await apiService.post('/content/assign', request);
  }

  async toggleContentStatus(request: ToggleContentStatusRequest): Promise<void> {
    await apiService.put(`/content/${request.contentId}/status`, { status: request.status });
  }

  async deleteContent(contentId: string): Promise<void> {
    await apiService.delete(`/content/${contentId}`);
  }
}

export const contentApiService = new ContentApiService();
