import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  private readonly httpClient = inject(HttpClient);

  public async isCsvCached(): Promise<boolean> {
    try {
      const result = await window.caches.match('/vkm-register.csv');
      console.log('CSV result', result);
      return result !== undefined;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async requestCsv(): Promise<void> {
    await firstValueFrom(this.httpClient.get('/vkm-register.csv', { responseType: 'text' }));
  }
}
