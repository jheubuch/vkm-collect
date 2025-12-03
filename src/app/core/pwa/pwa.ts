import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export default class PwaService {
  private swUpdate = inject(SwUpdate);

  private readonly versionUpdates = toSignal(this.swUpdate.versionUpdates);
  public readonly updateAvailable = signal<boolean>(false);

  private readonly mediaMatcher = matchMedia('(prefers-color-scheme: dark)');
  private readonly _darkMode = signal<boolean>(this.mediaMatcher.matches);
  public readonly darkMode = this._darkMode.asReadonly();

  constructor() {
    effect(() => {
      const updateState = this.versionUpdates()?.type;
      console.log('PWA update state', updateState);
      if (updateState === 'VERSION_READY') {
        this.updateAvailable.set(true);
      }
    });
    this.mediaMatcher.addEventListener('change', (event) => {
      this._darkMode.set(event.matches);
    });
  }

  public async activateUpdate(): Promise<void> {
    if (this.updateAvailable()) {
      window.location.reload();
    }
  }
}
