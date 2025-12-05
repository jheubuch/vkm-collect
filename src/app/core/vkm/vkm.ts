import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import VkmEntry from '../../models/vkm-entry';

@Injectable({
  providedIn: 'root',
})
export class VkmService {
  public readonly vkmEntries = signal<Map<string, VkmEntry>>(new Map());
  private readonly httpClient = inject(HttpClient);

  public async isVkmCached(): Promise<boolean> {
    try {
      const result = await window.caches.match('/vkm-register.json');
      console.log('VKM result', result);
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
    console.log('VKM fetched', entries);
    this.vkmEntries.set(new Map(entries.map((entry) => [entry.vkm, entry])));
  }
}
