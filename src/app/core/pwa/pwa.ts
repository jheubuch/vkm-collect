import { computed, inject, Injectable } from '@angular/core';
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

  public async activateUpdate(): Promise<void> {
    if (this.updateAvailable()) {
      window.location.reload();
    }
  }
}
