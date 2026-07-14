import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { PublicProvider } from '../shared/public.models';

@Component({
  selector: 'app-provider-card',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, RatingComponent],
  templateUrl: './provider-card.component.html',
  styleUrl: './provider-card.component.css',
})
export class ProviderCardComponent {
  provider = input.required<PublicProvider>();
  favoriteChange = output<string>();

  priceRange = computed(() => {
    const prices = this.provider().services.map(s => s.price);
    if (prices.length === 0) return '$';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min}`;
    return `${min} – ${max}`;
  });

  onFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteChange.emit(this.provider().profile._id);
  }
}
