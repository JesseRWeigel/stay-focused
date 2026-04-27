import { useEffect, useRef } from 'react';
import type { EEGDevice } from '../../core/types';
import { FocusGauge } from './FocusGauge';
import { getFocusLevel } from '../../processing/focusScore';
import { useNotifications } from '../hooks/useNotifications';

interface DashboardProps {
  device: EEGDevice;
  focus: number;
  calm: number;
  onLogout: () => void;
}

export function Dashboard({ device, focus, calm, onLogout }: DashboardProps) {
  const { send } = useNotifications();
  const prevLevel = useRef(getFocusLevel(focus));

  // Alert when focus drops to low (preserving original app behavior)
  useEffect(() => {
    const level = getFocusLevel(focus);
    if (level === 'low' && prevLevel.current !== 'low') {
      send('Stay focused!');
    }
    prevLevel.current = level;
  }, [focus, send]);

  const info = device.deviceInfo();
  const focusLevel = getFocusLevel(focus);

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: focusLevel === 'low' ? '#fef2f2' : '#fff',
        transition: 'background-color 0.5s ease',
      }}
    >
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Stay Focused</h1>
          <p style={styles.deviceInfo}>
            Connected to {info.name}
            {info.type === 'demo' ? ' (simulated)' : ''}
          </p>
        </div>
        <button style={styles.logoutButton} onClick={onLogout}>
          Disconnect
        </button>
      </div>

      <div style={styles.gaugeSection}>
        <FocusGauge focus={focus} />
      </div>

      <div style={styles.metricsRow}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Focus</div>
          <div style={styles.metricValue}>{Math.round(focus * 100)}%</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Calm</div>
          <div style={styles.metricValue}>{Math.round(calm * 100)}%</div>
        </div>
      </div>

      {focusLevel === 'low' && (
        <div style={styles.alert}>
          Focus is low! Take a deep breath and refocus.
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 32,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 0,
    color: '#1a1a1a',
  },
  deviceInfo: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
  },
  gaugeSection: {
    marginBottom: 32,
  },
  metricsRow: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
  },
  metricCard: {
    flex: 1,
    maxWidth: 200,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  alert: {
    marginTop: 24,
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 500,
  },
};
