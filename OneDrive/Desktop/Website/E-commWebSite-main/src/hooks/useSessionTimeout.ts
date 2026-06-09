import { useEffect, useRef, useState } from 'react';

const INACTIVITY_MS = 30 * 60 * 1000;   // 30 minutes
const SESSION_MAX_MS = 8 * 60 * 60 * 1000; // 8 hours
const WARNING_BEFORE_MS = 2 * 60 * 1000;  // warn 2 min before logout
const CHECK_INTERVAL_MS = 30 * 1000;      // main check every 30s

const KEY_LAST_ACTIVE = 'ecomm_last_active';
const KEY_SESSION_START = 'ecomm_session_start';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const;

export function useSessionTimeout(logout: () => Promise<void>, isLoggedIn: boolean) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const logoutRef = useRef(logout);
  logoutRef.current = logout;
  const showWarningRef = useRef(showWarning);
  showWarningRef.current = showWarning;

  // Initialise session timestamps on login
  useEffect(() => {
    if (!isLoggedIn) {
      sessionStorage.removeItem(KEY_LAST_ACTIVE);
      sessionStorage.removeItem(KEY_SESSION_START);
      setShowWarning(false);
      return;
    }
    const now = String(Date.now());
    if (!sessionStorage.getItem(KEY_SESSION_START)) sessionStorage.setItem(KEY_SESSION_START, now);
    if (!sessionStorage.getItem(KEY_LAST_ACTIVE)) sessionStorage.setItem(KEY_LAST_ACTIVE, now);
  }, [isLoggedIn]);

  // Activity listeners — reset last-active timestamp
  useEffect(() => {
    if (!isLoggedIn) return;

    const onActivity = () => {
      sessionStorage.setItem(KEY_LAST_ACTIVE, String(Date.now()));
      if (showWarningRef.current) setShowWarning(false);
    };

    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, onActivity, { passive: true }));
    return () => ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, onActivity));
  }, [isLoggedIn]);

  // Main check: inactivity + max session age
  useEffect(() => {
    if (!isLoggedIn) return;

    const check = () => {
      const now = Date.now();
      const lastActive = parseInt(sessionStorage.getItem(KEY_LAST_ACTIVE) ?? '0', 10);
      const sessionStart = parseInt(sessionStorage.getItem(KEY_SESSION_START) ?? '0', 10);

      if (now - sessionStart >= SESSION_MAX_MS) {
        logoutRef.current();
        return;
      }

      const inactive = now - lastActive;
      if (inactive >= INACTIVITY_MS) {
        logoutRef.current();
        return;
      }

      if (inactive >= INACTIVITY_MS - WARNING_BEFORE_MS) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isLoggedIn]);

  // Countdown ticker — only active while warning is shown
  useEffect(() => {
    if (!showWarning) return;

    const tick = () => {
      const lastActive = parseInt(sessionStorage.getItem(KEY_LAST_ACTIVE) ?? '0', 10);
      const remaining = Math.ceil((INACTIVITY_MS - (Date.now() - lastActive)) / 1000);
      if (remaining <= 0) {
        logoutRef.current();
      } else {
        setSecondsLeft(remaining);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [showWarning]);

  const extendSession = () => {
    sessionStorage.setItem(KEY_LAST_ACTIVE, String(Date.now()));
    setShowWarning(false);
  };

  return { showWarning, secondsLeft, extendSession };
}
