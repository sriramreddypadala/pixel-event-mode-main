/**
 * BOOTH STORE - Booth-scoped state management
 * Handles booth identity, configuration, and session-safe updates
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BoothIdentity,
  BoothConfig,
  BoothConfigState,
  BoothStatusType,
} from '@/types/booth.types';

interface BoothStore {
  // Booth Identity (immutable after setup)
  identity: BoothIdentity | null;
  
  // Configuration State (session-safe)
  configState: BoothConfigState | null;
  
  // Runtime Status
  status: BoothStatusType;
  isInSession: boolean;
  
  // Actions
  setIdentity: (identity: BoothIdentity) => void;
  setActiveConfig: (config: BoothConfig) => void;
  setPendingConfig: (config: BoothConfig) => void;
  applyPendingConfig: () => void;
  clearPendingConfig: () => void;
  setStatus: (status: BoothStatusType) => void;
  setSessionState: (isInSession: boolean) => void;
  
  // Getters
  getBoothId: () => string | null;
  hasIdentity: () => boolean;
  hasPendingChanges: () => boolean;
  canApplyConfigImmediately: () => boolean;
}

export const useBoothStore = create<BoothStore>()(
  persist(
    (set, get) => ({
      // Initial State
      identity: null,
      configState: null,
      status: 'offline',
      isInSession: false,

      // Set booth identity (once during installation)
      setIdentity: (identity) => {
        set({ identity });
      },

      // Set active configuration
      setActiveConfig: (config) => {
        set((state) => ({
          configState: {
            activeConfig: config,
            pendingConfig: state.configState?.pendingConfig,
            hasPendingChanges: !!state.configState?.pendingConfig,
          },
        }));
      },

      // Queue configuration for later (session-safe)
      setPendingConfig: (config) => {
        set((state) => ({
          configState: {
            activeConfig: state.configState?.activeConfig || config,
            pendingConfig: config,
            hasPendingChanges: true,
          },
        }));
      },

      // Apply pending configuration (after session ends)
      applyPendingConfig: () => {
        set((state) => {
          if (!state.configState?.pendingConfig) return state;
          
          return {
            configState: {
              activeConfig: state.configState.pendingConfig,
              pendingConfig: undefined,
              hasPendingChanges: false,
            },
          };
        });
      },

      // Clear pending configuration
      clearPendingConfig: () => {
        set((state) => ({
          configState: state.configState
            ? {
                ...state.configState,
                pendingConfig: undefined,
                hasPendingChanges: false,
              }
            : null,
        }));
      },

      // Set booth status
      setStatus: (status) => {
        set({ status });
      },

      // Set session state
      setSessionState: (isInSession) => {
        set({ isInSession });
        
        // Auto-apply pending config when session ends
        if (!isInSession && get().hasPendingChanges()) {
          get().applyPendingConfig();
        }
      },

      // Get booth ID
      getBoothId: () => {
        return get().identity?.boothId || null;
      },

      // Check if booth has identity
      hasIdentity: () => {
        return !!get().identity;
      },

      // Check if there are pending changes
      hasPendingChanges: () => {
        return get().configState?.hasPendingChanges || false;
      },

      // Check if config can be applied immediately
      canApplyConfigImmediately: () => {
        return !get().isInSession;
      },
    }),
    {
      name: 'pixxel8-booth-storage',
      partialize: (state) => ({
        identity: state.identity,
        configState: state.configState,
      }),
    }
  )
);
