import { useEffect, useRef, useState, useCallback } from 'react';

type UseIdleTimeoutOptions = {
  timeout: number; // milliseconds
  warningTime?: number; // milliseconds before timeout to show warning
  onIdle: () => void;
  onWarning?: () => void;
  onActive?: () => void;
  enabled?: boolean;
};

export function useIdleTimeout({
  timeout,
  warningTime = 30000, // 30 seconds warning by default
  onIdle,
  onWarning,
  onActive,
  enabled = true,
}: UseIdleTimeoutOptions) {
  const [isIdle, setIsIdle] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const warningTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const lastActivityRef = useRef<number>(Date.now());

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    if (!enabled) return;

    clearTimers();
    setIsIdle(false);
    setShowWarning(false);
    setTimeLeft(0);
    lastActivityRef.current = Date.now();

    if (onActive) onActive();

    // Set warning timer
    const warningDelay = timeout - warningTime;
    if (warningDelay > 0) {
      warningTimerRef.current = setTimeout(() => {
        setShowWarning(true);
        setTimeLeft(Math.floor(warningTime / 1000));
        
        if (onWarning) onWarning();

        // Start countdown
        countdownIntervalRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdownIntervalRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, warningDelay);
    }

    // Set idle timer
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      setShowWarning(false);
      onIdle();
    }, timeout);
  }, [enabled, timeout, warningTime, onIdle, onWarning, onActive, clearTimers]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const handleActivity = () => {
      const now = Date.now();
      // Throttle activity detection to avoid excessive resets
      if (now - lastActivityRef.current > 1000) {
        resetTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimers();
    };
  }, [enabled, resetTimer, clearTimers]);

  return {
    isIdle,
    showWarning,
    timeLeft,
    resetTimer,
  };
}
