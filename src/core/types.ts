import { Observable } from 'rxjs';

export type DeviceType = 'neurosity' | 'muse' | 'brainbit' | 'emotiv' | 'ganglion' | 'demo';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface BandPower {
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export interface EEGSample {
  timestamp: number;
  channels: number[];
}

export interface SignalQuality {
  overall: number; // 0-1
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: DeviceType;
  manufacturer: string;
}

export interface EEGDevice {
  readonly id: string;
  readonly name: string;
  readonly type: DeviceType;

  connect(options?: Record<string, unknown>): Promise<void>;
  disconnect(): Promise<void>;
  status(): Observable<ConnectionStatus>;

  focus(): Observable<number>;
  calm(): Observable<number>;

  deviceInfo(): DeviceInfo;
}

export interface LoginCredentials {
  deviceId: string;
  email: string;
  password: string;
}
