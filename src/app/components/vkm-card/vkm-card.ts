import { Component, computed, inject, input } from '@angular/core';
import VkmEntry from '../../models/vkm-entry';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { VkmService } from '../../core/vkm/vkm';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vkm-card',
  imports: [DatePipe, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './vkm-card.html',
  styleUrl: './vkm-card.css',
})
export class VkmCard {
  private readonly vkmService = inject(VkmService);

  public readonly vkm = input.required<VkmEntry>();
  public readonly lastSeen = computed(() => {
    const seenVkms = this.vkmService.seenVkms();
    return seenVkms.get(this.vkm().vkm) ?? null;
  });

  public markAsSeen(): void {
    this.vkmService.markVkmAsSeen(this.vkm().vkm);
  }

  public markAsUnseen(): void {
    this.vkmService.markVkmAsUnseen(this.vkm().vkm);
  }
}
