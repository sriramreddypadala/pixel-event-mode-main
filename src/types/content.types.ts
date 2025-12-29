/**
 * CONTENT MANAGEMENT TYPES
 * Visual content used in photo booths
 */

export type ContentType = 'background' | 'overlay' | 'frame';
export type ContentStatus = 'active' | 'disabled';
export type ContentAssignment = 'all' | 'specific';

export interface ContentItem {
  id: string;
  name: string;
  type: ContentType;
  status: ContentStatus;
  thumbnailUrl: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  assignment: ContentAssignment;
  assignedBoothIds: string[];
  createdAt: string;
  updatedAt: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ContentListResponse {
  items: ContentItem[];
  total: number;
}

export interface AssignContentRequest {
  contentId: string;
  assignment: ContentAssignment;
  boothIds?: string[];
}

export interface ToggleContentStatusRequest {
  contentId: string;
  status: ContentStatus;
}
