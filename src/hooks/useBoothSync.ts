/**
 * BOOTH SYNC HOOK - Automatic config synchronization
 * Handles heartbeat, config polling, and session-safe updates
 */

import { useEffect, useRef } from 'react';
import { useBoothStore } from '@/store/boothStore';
import { boothService } from '@/services/booth.service';

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const CONFIG_CHECK_INTERVAL = 60000; // 60 seconds

export function useBoothSync() {
  const { identity, status, isInSession, getBoothId, setPendingConfig, canApplyConfigImmediately, setActiveConfig } = useBoothStore();
  
  const heartbeatIntervalRef = useRef<number>();
  const configCheckIntervalRef = useRef<number>();

  // Send heartbeat
  const sendHeartbeat = async () => {
    const boothId = getBoothId();
    if (!boothId) return;

    try {
      await boothService.sendHeartbeat({
        boothId,
        status,
        isInSession,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Heartbeat failed:', error);
    }
  };

  // Check for pending config updates
  const checkPendingConfig = async () => {
    const boothId = getBoothId();
    if (!boothId) return;

    try {
      const pendingConfig = await boothService.checkPendingConfig(boothId);
      
      if (pendingConfig) {
        if (canApplyConfigImmediately()) {
          // Apply immediately if not in session
          setActiveConfig(pendingConfig);
          console.log('✅ Config applied immediately');
        } else {
          // Queue for later if in session
          setPendingConfig(pendingConfig);
          console.log('⏳ Config queued - will apply after session');
        }
      }
    } catch (error) {
      console.error('Config check failed:', error);
    }
  };

  // Start sync intervals
  useEffect(() => {
    if (!identity) return;

    // Initial sync
    sendHeartbeat();
    checkPendingConfig();

    // Setup intervals
    heartbeatIntervalRef.current = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    configCheckIntervalRef.current = window.setInterval(checkPendingConfig, CONFIG_CHECK_INTERVAL);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (configCheckIntervalRef.current) {
        clearInterval(configCheckIntervalRef.current);
      }
    };
  }, [identity]);

  return {
    sendHeartbeat,
    checkPendingConfig,
  };
}
