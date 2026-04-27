import { useState, useEffect, useCallback, useRef } from 'react';
import type { EEGDevice, ConnectionStatus, DeviceType } from '../../core/types';
import { createDevice } from '../../core/DeviceManager';
import type { Subscription } from 'rxjs';

interface UseDeviceReturn {
  device: EEGDevice | null;
  status: ConnectionStatus;
  focus: number;
  calm: number;
  connect: (type: DeviceType, deviceId?: string, credentials?: Record<string, unknown>) => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
}

export function useDevice(): UseDeviceReturn {
  const [device, setDevice] = useState<EEGDevice | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [focus, setFocus] = useState(0);
  const [calm, setCalm] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const subscriptions = useRef<Subscription[]>([]);

  // Clean up subscriptions when device changes or unmounts
  useEffect(() => {
    return () => {
      subscriptions.current.forEach((s) => s.unsubscribe());
      subscriptions.current = [];
    };
  }, [device]);

  const connect = useCallback(
    async (type: DeviceType, deviceId?: string, credentials?: Record<string, unknown>) => {
      try {
        setError(null);
        const dev = createDevice(type, deviceId);
        await dev.connect(credentials);
        setDevice(dev);

        // Subscribe to status
        const statusSub = dev.status().subscribe((s) => setStatus(s));
        subscriptions.current.push(statusSub);

        // Subscribe to focus
        const focusSub = dev.focus().subscribe((f) => setFocus(f));
        subscriptions.current.push(focusSub);

        // Subscribe to calm
        const calmSub = dev.calm().subscribe((c) => setCalm(c));
        subscriptions.current.push(calmSub);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed');
        setStatus('error');
      }
    },
    []
  );

  const disconnect = useCallback(async () => {
    subscriptions.current.forEach((s) => s.unsubscribe());
    subscriptions.current = [];
    if (device) {
      await device.disconnect();
    }
    setDevice(null);
    setFocus(0);
    setCalm(0);
    setStatus('disconnected');
    setError(null);
  }, [device]);

  return { device, status, focus, calm, connect, disconnect, error };
}
