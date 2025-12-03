import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Meta } from '@angular/platform-browser';
import PwaService from './core/pwa/pwa';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly meta = inject(Meta);
  private readonly pwaService = inject(PwaService);

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
  }

  private getPrimaryColor(dark: boolean): string {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(
      '--mat-sys-primary'
    );

    const regexMatches = primaryColor.match(/light-dark\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/);

    return regexMatches !== null ? regexMatches[dark ? 2 : 1] : '';
  }
}
