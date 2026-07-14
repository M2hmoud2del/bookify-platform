import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PublicProvider } from '../shared/public.models';

@Component({
  selector: 'app-provider-header',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, RatingComponent, BadgeComponent, ButtonComponent],
  templateUrl: './provider-header.component.html',
  styleUrl: './provider-header.component.css',
})
export class ProviderHeaderComponent {
  provider = input.required<PublicProvider>();
  favorite = output<void>();
  book = output<void>();

  priceRange = computed(() => {
    const prices = this.provider().services.map(s => s.price);
    if (prices.length === 0) return '$';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min}`;
    return `${min} – ${max}`;
  });
}
