// Public API for the Stay Focused BCI abstraction layer
export type {
  EEGDevice,
  DeviceType,
  ConnectionStatus,
  BandPower,
  EEGSample,
  SignalQuality,
  DeviceInfo,
  LoginCredentials,
} from './core/types';

export { createDevice } from './core/DeviceManager';
export { NeurosityDriver } from './core/drivers/neurosity';
export { DemoDriver } from './core/drivers/demo';
export { getFocusLevel, focusFromBandPower, DEFAULT_THRESHOLDS } from './processing/focusScore';
