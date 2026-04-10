import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import type { EEGDevice, ConnectionStatus, DeviceInfo } from '../types';

/**
 * Demo driver that generates simulated EEG focus/calm data.
 * Useful for testing the UI without a physical headset.
 *
 * Generates a smooth random walk that oscillates between 0 and 1,
 * mimicking realistic-ish focus fluctuations.
 */
export class DemoDriver implements EEGDevice {
  readonly id = 'demo';
  readonly name = 'Demo (Simulated)';
  readonly type = 'demo' as const;

  private statusSubject = new BehaviorSubject<ConnectionStatus>('disconnected');
  private focusValue = 0.5;
  private calmValue = 0.5;

  async connect(): Promise<void> {
    this.statusSubject.next('connecting');
    // Simulate a brief connection delay
    await new Promise((r) => setTimeout(r, 500));
    this.statusSubject.next('connected');
  }

  async disconnect(): Promise<void> {
    this.statusSubject.next('disconnected');
  }

  status(): Observable<ConnectionStatus> {
    return this.statusSubject.asObservable();
  }

  focus(): Observable<number> {
    return interval(1000).pipe(
      map(() => {
        // Random walk with mean reversion
        this.focusValue += (Math.random() - 0.5) * 0.15;
        this.focusValue += (0.5 - this.focusValue) * 0.05; // pull toward 0.5
        this.focusValue = Math.max(0, Math.min(1, this.focusValue));
        return Number(this.focusValue.toFixed(2));
      })
    );
  }

  calm(): Observable<number> {
    return interval(1200).pipe(
      map(() => {
        this.calmValue += (Math.random() - 0.5) * 0.12;
        this.calmValue += (0.6 - this.calmValue) * 0.05;
        this.calmValue = Math.max(0, Math.min(1, this.calmValue));
        return Number(this.calmValue.toFixed(2));
      })
    );
  }

  deviceInfo(): DeviceInfo {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      manufacturer: 'Simulated',
    };
  }
}
