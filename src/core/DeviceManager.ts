import type { EEGDevice, DeviceType } from './types';
import { NeurosityDriver } from './drivers/neurosity';
import { DemoDriver } from './drivers/demo';

/**
 * Factory that creates the appropriate EEGDevice driver based on type.
 * As new drivers are added (Muse, BrainBit, etc.), register them here.
 */
export function createDevice(type: DeviceType, deviceId?: string): EEGDevice {
  switch (type) {
    case 'neurosity':
      if (!deviceId) throw new Error('Neurosity requires a deviceId');
      return new NeurosityDriver(deviceId);
    case 'demo':
      return new DemoDriver();
    default:
      throw new Error(`Driver not yet implemented: ${type}`);
  }
}
