/**
 * CONTENT STORE
 * State management for visual content
 */

import { create } from 'zustand';
import type { ContentItem, ContentType, ContentStatus } from '@/types/content.types';

interface ContentStore {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
  filterType: ContentType | 'all';
  filterStatus: ContentStatus | 'all';
  selectedItem: ContentItem | null;
  
  // Actions
  setItems: (items: ContentItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setFilterType: (type: ContentType | 'all') => void;
  setFilterStatus: (status: ContentStatus | 'all') => void;
  setSelectedItem: (item: ContentItem | null) => void;
  
  // Content operations
  toggleContentStatus: (contentId: string) => void;
  updateContentAssignment: (contentId: string, assignment: 'all' | 'specific', boothIds?: string[]) => void;
  
  // Computed
  getFilteredItems: () => ContentItem[];
}

export const useContentStore = create<ContentStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  viewMode: 'grid',
  filterType: 'all',
  filterStatus: 'all',
  selectedItem: null,
  
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  
  toggleContentStatus: (contentId) => {
    const items = get().items.map(item => {
      if (item.id === contentId) {
        return {
          ...item,
          status: item.status === 'active' ? 'disabled' as const : 'active' as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    set({ items });
  },
  
  updateContentAssignment: (contentId, assignment, boothIds = []) => {
    const items = get().items.map(item => {
      if (item.id === contentId) {
        return {
          ...item,
          assignment,
          assignedBoothIds: assignment === 'all' ? [] : boothIds,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    set({ items });
  },
  
  getFilteredItems: () => {
    const { items, filterType, filterStatus } = get();
    return items.filter(item => {
      const typeMatch = filterType === 'all' || item.type === filterType;
      const statusMatch = filterStatus === 'all' || item.status === filterStatus;
      return typeMatch && statusMatch;
    });
  },
}));
