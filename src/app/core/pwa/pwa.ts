import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export default class PwaService {
  private swUpdate = inject(SwUpdate);

  private versionUpdates = toSignal(this.swUpdate.versionUpdates);
  public updateAvailable = computed(() => {
    const updateState = this.versionUpdates()?.type;
    console.log('PWA update state', updateState);
    return updateState === 'VERSION_READY';
  });

  private readonly mediaMatcher = matchMedia('(prefers-color-scheme: dark)');
  private readonly _darkMode = signal<boolean>(this.mediaMatcher.matches);
  public readonly darkMode = this._darkMode.asReadonly();

  constructor() {
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
