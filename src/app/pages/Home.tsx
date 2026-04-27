import { useDevice } from '../hooks/useDevice';
import { LoginForm } from '../components/LoginForm';
import { Dashboard } from '../components/Dashboard';

export function Home() {
  const { device, status, focus, calm, connect, disconnect, error } = useDevice();

  const isConnected = status === 'connected' && device !== null;
  const isConnecting = status === 'connecting';

  const handleConnectNeurosity = (deviceId: string, email: string, password: string) => {
    connect('neurosity', deviceId, { deviceId, email, password });
  };

  const handleConnectDemo = () => {
    connect('demo');
  };

  if (isConnected && device) {
    return (
      <Dashboard
        device={device}
        focus={focus}
        calm={calm}
        onLogout={disconnect}
      />
    );
  }

  return (
    <LoginForm
      onConnectNeurosity={handleConnectNeurosity}
      onConnectDemo={handleConnectDemo}
      error={error}
      isConnecting={isConnecting}
    />
  );
}
