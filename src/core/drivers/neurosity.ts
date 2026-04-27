import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import type { EEGDevice, ConnectionStatus, DeviceInfo, LoginCredentials } from '../types';

/**
 * Neurosity Crown driver.
 *
 * Wraps the @neurosity/notion SDK behind the EEGDevice interface.
 * The Notion SDK connects via Neurosity's cloud (Firebase), so it works
 * in any browser -- no Web Bluetooth required.
 */
export class NeurosityDriver implements EEGDevice {
  readonly id: string;
  readonly name = 'Neurosity Crown';
  readonly type = 'neurosity' as const;

  private notion: any = null;
  private statusSubject = new BehaviorSubject<ConnectionStatus>('disconnected');

  constructor(deviceId: string) {
    this.id = deviceId;
  }

  async connect(options?: Record<string, unknown>): Promise<void> {
    const creds = options as unknown as LoginCredentials | undefined;
    if (!creds?.email || !creds?.password) {
      throw new Error('Neurosity requires email and password to connect');
    }

    this.statusSubject.next('connecting');

    try {
      // Dynamic import so the app doesn't crash if @neurosity/notion isn't installed
      const { Notion } = await import('@neurosity/notion');
      this.notion = new Notion({ deviceId: this.id });

      const auth = await this.notion.login({
        email: creds.email,
        password: creds.password,
      });

      if (!auth) {
        throw new Error('Login failed');
      }

      this.statusSubject.next('connected');
    } catch (err) {
      this.statusSubject.next('error');
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    if (this.notion) {
      await this.notion.logout();
      this.notion = null;
    }
    this.statusSubject.next('disconnected');
  }

  status(): Observable<ConnectionStatus> {
    return this.statusSubject.asObservable();
  }

  focus(): Observable<number> {
    if (!this.notion) return EMPTY;
    return (this.notion.focus() as Observable<{ probability: number }>).pipe(
      map((f) => Number(f.probability.toFixed(2)))
    );
  }

  calm(): Observable<number> {
    if (!this.notion) return EMPTY;
    return (this.notion.calm() as Observable<{ probability: number }>).pipe(
      map((c) => Number(c.probability.toFixed(2)))
    );
  }

  deviceInfo(): DeviceInfo {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      manufacturer: 'Neurosity',
    };
  }
}
