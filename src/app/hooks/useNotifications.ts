import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage browser notifications.
 * Requests permission on mount (if not already granted/denied)
 * and provides a send function.
 */
export function useNotifications() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      setEnabled(true);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        setEnabled(permission === 'granted');
      });
    }
  }, []);

  const send = useCallback(
    (message: string) => {
      if (enabled) {
        new Notification(message);
      }
    },
    [enabled]
  );

  return { enabled, send };
}
