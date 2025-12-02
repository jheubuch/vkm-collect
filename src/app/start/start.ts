import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import PwaService from '../core/pwa/pwa';

@Component({
  selector: 'app-start',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './start.html',
  styleUrl: './start.css',
})
export default class Start {
  private readonly pwaService = inject(PwaService);
  public readonly updateAvailable = this.pwaService.updateAvailable;
  public readonly vkm = model<string>('');

  public async updateApplication(): Promise<void> {
    await this.pwaService.activateUpdate();
  }
}
