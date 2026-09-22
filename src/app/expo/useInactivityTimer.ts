// src/hooks/useInactivityTimer.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInactivityTimerOptions {
  timeoutMs?: number;
  onTimeout?: () => void;
  enabled?: boolean;
}

export function useInactivityTimer({
  timeoutMs = 45000,
  onTimeout,
  enabled = true,
}: UseInactivityTimerOptions = {}) {
  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  // Mantener la referencia actualizada sin forzar re-renders del effect
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const resetTimer = useCallback(() => {
    setIsInactive(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (enabled) {
      timerRef.current = setTimeout(() => {
        setIsInactive(true);
        if (onTimeoutRef.current) {
          onTimeoutRef.current();
        }
      }, timeoutMs);
    }
  }, [enabled, timeoutMs]);

  useEffect(() => {
    if (!enabled) return;

    // Inicializar temporizador al montar
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsInactive(true);
      if (onTimeoutRef.current) {
        onTimeoutRef.current();
      }
    }, timeoutMs);

    const events = ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'click'];

    const handleUserActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [enabled, timeoutMs, resetTimer]);

  return { isInactive, resetTimer };
}