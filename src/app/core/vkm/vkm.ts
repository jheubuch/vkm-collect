import { HttpClient, HttpHeaders } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import VkmEntry from '../../models/vkm-entry';

@Injectable({
  providedIn: 'root',
})
export class VkmService {
  private readonly _vkmEntries = signal<Map<string, VkmEntry>>(new Map());
  private readonly _seenVkms = signal<Map<string, Date>>(new Map());
  private readonly httpClient = inject(HttpClient);

  public readonly vkmEntries = this._vkmEntries.asReadonly();
  public readonly seenVkms = this._seenVkms.asReadonly();

  constructor() {
    const stored = localStorage.getItem('seenVkms');
    if (stored) {
      try {
        const entries: [string, string][] = JSON.parse(stored);
        const map = new Map(entries.map(([key, iso]) => [key, new Date(iso)]));
        this._seenVkms.set(map);
      } catch (e) {
        console.error('Fehler beim Parsen von seenVkms', e);
      }
    }

    effect(() => {
      const seenVkms = this._seenVkms();
      const serialized = JSON.stringify(
        Array.from(seenVkms.entries()).map(([key, date]) => [key, date.toISOString()])
      );
      localStorage.setItem('seenVkms', serialized);
    });
  }

  public async isVkmCached(): Promise<boolean> {
    try {
      const result = await window.caches.match('/vkm-register.json');
      return result !== undefined;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async requestVkm(force: boolean = false): Promise<void> {
    const headers = new HttpHeaders();
    if (force) {
      headers.set('ngsw-bypass', 'true');
    }
    const entries = await firstValueFrom(
      this.httpClient.get<VkmEntry[]>('/vkm-register.json', { headers: headers })
    );
    this._vkmEntries.set(new Map(entries.map((entry) => [entry.vkm, entry])));
  }

  public markVkmAsSeen(vkm: string): void {
    this._seenVkms.update((seenVkms) => new Map(seenVkms.set(vkm, new Date())));
  }

  public markVkmAsUnseen(vkm: string): void {
    this._seenVkms.update((seenVkms) => {
      seenVkms.delete(vkm);
      return new Map(seenVkms);
    });
  }
}
