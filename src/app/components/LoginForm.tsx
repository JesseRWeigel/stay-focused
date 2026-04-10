import { useState } from 'react';

interface LoginFormProps {
  onConnectNeurosity: (deviceId: string, email: string, password: string) => void;
  onConnectDemo: () => void;
  error: string | null;
  isConnecting: boolean;
}

export function LoginForm({ onConnectNeurosity, onConnectDemo, error, isConnecting }: LoginFormProps) {
  const [deviceId, setDeviceId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnectNeurosity(deviceId, email, password);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Stay Focused</h1>
      <p style={styles.subtitle}>EEG-powered focus tracking</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.sectionTitle}>Connect Neurosity Crown</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button
          style={styles.button}
          type="submit"
          disabled={isConnecting || !deviceId || !email || !password}
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>
      </form>

      <div style={styles.divider}>
        <span style={styles.dividerText}>or</span>
      </div>

      <button
        style={{ ...styles.button, ...styles.demoButton }}
        onClick={onConnectDemo}
        disabled={isConnecting}
      >
        Try Demo Mode
      </button>
      <p style={styles.demoHint}>No headset required — uses simulated data</p>

      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 400,
    margin: '0 auto',
    padding: 32,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  subtitle: {
    color: '#666',
    marginBottom: 32,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
  },
  demoButton: {
    backgroundColor: '#6366f1',
    width: '100%',
    maxWidth: 400,
  },
  demoHint: {
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  dividerText: {
    flex: 1,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  error: {
    marginTop: 16,
    padding: '10px 12px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: 6,
    fontSize: 14,
  },
};
