import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Meta } from '@angular/platform-browser';
import PwaService from './core/pwa/pwa';
import { VkmService } from './core/vkm/vkm';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly meta = inject(Meta);
  private readonly pwaService = inject(PwaService);
  private readonly vkmService = inject(VkmService);

  public readonly vkmAvailable = signal<boolean | null>(null);

  constructor() {
    effect(() => {
      const darkMode = this.pwaService.darkMode();
      const primary = this.getPrimaryColor(darkMode);
      const existing = this.meta.getTag("name='theme-color'");
      if (existing) {
        this.meta.updateTag({ name: 'theme-color', content: primary }, 'name="theme-color"');
      } else {
        this.meta.addTag({ name: 'theme-color', content: primary });
      }
    });

    this.checkVkmAvailability();
  }

  public async requestVkm(): Promise<void> {
    console.log(await this.vkmService.requestVkm(true));
    await this.checkVkmAvailability();
  }

  private async checkVkmAvailability(): Promise<void> {
    this.vkmAvailable.set(await this.vkmService.isVkmCached());
  }

  private getPrimaryColor(dark: boolean): string {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(
      '--mat-sys-primary'
    );

    const regexMatches = primaryColor.match(/light-dark\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/);

    return regexMatches !== null ? regexMatches[dark ? 2 : 1] : '';
  }
}
