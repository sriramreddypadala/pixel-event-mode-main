import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GridTemplate } from '@/types/grid';
import { MOCK_GRID_TEMPLATES } from '@/types/grid';

interface GridStore {
  // Grid templates (FIXED - no modifications allowed)
  templates: GridTemplate[];
  activeGrid: GridTemplate | null;
  pendingGrid: GridTemplate | null;

  // Session state
  isSessionActive: boolean;

  // Actions - Grid Activation (selection only)
  setActiveGrid: (templateId: string) => void;
  applyPendingGrid: () => void;
  clearPendingGrid: () => void;

  // Actions - Session Management
  startSession: () => void;
  endSession: () => void;

  // Utilities
  getTemplateById: (id: string) => GridTemplate | undefined;
  getGridsByStillCount: (count: number) => GridTemplate[];
  canApplyGridImmediately: () => boolean;
}

export const useGridStore = create<GridStore>()(
  persist(
    (set, get) => ({
      // Initial state - FIXED templates only
      templates: MOCK_GRID_TEMPLATES,
      activeGrid: MOCK_GRID_TEMPLATES[0],
      pendingGrid: null,
      isSessionActive: false,

      // Template Management - DISABLED (fixed layouts only)
      // No add, update, delete, or duplicate functions

      // Grid Activation
      setActiveGrid: (templateId) => {
        const template = get().getTemplateById(templateId);
        if (!template) return;

        const { isSessionActive } = get();

        if (isSessionActive) {
          // Session active - set as pending
          set({ pendingGrid: template });
          console.log('[GridStore] Grid queued as pending:', template.name);
        } else {
          // No session - apply immediately
          set({ activeGrid: template, pendingGrid: null });
          console.log('[GridStore] Grid applied immediately:', template.name);
        }
      },

      applyPendingGrid: () => {
        const { pendingGrid } = get();
        if (pendingGrid) {
          set({ activeGrid: pendingGrid, pendingGrid: null });
          console.log('[GridStore] Pending grid promoted to active:', pendingGrid.name);
        }
      },

      clearPendingGrid: () => {
        set({ pendingGrid: null });
      },

      // Session Management
      startSession: () => {
        set({ isSessionActive: true });
        console.log('[GridStore] Session started - grid locked');
      },

      endSession: () => {
        set({ isSessionActive: false });
        // Auto-apply pending grid if exists
        get().applyPendingGrid();
        console.log('[GridStore] Session ended - grid unlocked');
      },

      // Get grids by still count
      getGridsByStillCount: (count: number) => {
        return get().templates.filter(t => t.isEnabled && t.stillCount === count);
      },

      // Utilities
      getTemplateById: (id) => {
        return get().templates.find((t) => t.id === id);
      },

      canApplyGridImmediately: () => {
        return !get().isSessionActive;
      },
    }),
    {
      name: 'fixed-grid-storage', // Changed name to force fresh load of fixed templates
      partialize: (state) => ({
        // Only persist active grid selection, not templates (they're fixed)
        activeGrid: state.activeGrid,
      }),
    }
  )
);
