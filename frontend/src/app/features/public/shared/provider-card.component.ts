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
  template: `
    <div class="provider-card" [routerLink]="['/providers', provider().user._id]">
      <div class="card-cover">
        <img [src]="provider().profile.profileImage.url" [alt]="provider().profile.businessName" loading="lazy" />
        <div class="cover-overlay"></div>
        @if (provider().profile.isVerified) {
          <span class="verified-badge" title="Verified Business">
            <span class="material-icons-outlined">verified</span>
          </span>
        }
        <button
          type="button"
          class="favorite-btn"
          (click)="onFavorite($event)"
          aria-label="Add to favorites"
        >
          <span class="material-icons-outlined">favorite_border</span>
        </button>
      </div>

      <div class="card-body">
        <div class="card-header">
          <app-avatar
            [src]="provider().user.avatar ?? provider().profile.profileImage.url"
            [name]="provider().profile.businessName"
            size="md"
          />
          <div class="header-info">
            <h3 class="provider-name">{{ provider().profile.businessName }}</h3>
            <p class="provider-type">{{ provider().profile.category }}</p>
          </div>
        </div>

        <div class="card-rating">
          <app-rating [value]="provider().profile.ratingAverage" [readonly]="true" [showValue]="true" />
          <span class="review-count">({{ provider().profile.ratingCount }} reviews)</span>
        </div>

        <div class="card-meta">
          <span class="meta-item">
            <span class="material-icons-outlined">location_on</span>
            {{ provider().profile.city }}
          </span>
          <span class="meta-item">
            <span class="material-icons-outlined">category</span>
            {{ provider().profile.category }}
          </span>
        </div>

        <div class="card-footer">
          <span class="price-range">{{ priceRange() }}</span>
          <span class="service-count">{{ provider().services.length }} services</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .provider-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: box-shadow var(--transition-normal), transform var(--transition-normal), border-color var(--transition-normal);
      text-decoration: none;
      color: inherit;
      display: block;

      &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-4px);
        border-color: var(--primary-200);
      }
    }

    :host-context(.dark) .provider-card {
      background: var(--gray-800);
      border-color: var(--gray-700);

      &:hover {
        border-color: var(--primary-500);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      }
    }

    /* Cover */
    .card-cover {
      position: relative;
      height: 160px;
      overflow: hidden;
    }

    .card-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .provider-card:hover .card-cover img {
      transform: scale(1.05);
    }

    .cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.3) 100%);
    }

    .verified-badge {
      position: absolute;
      top: var(--space-3);
      left: var(--space-3);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: var(--radius-full);
      color: var(--primary-500);
      backdrop-filter: blur(4px);
    }

    .verified-badge .material-icons-outlined { font-size: 1.125rem; }

    .favorite-btn {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      border-radius: var(--radius-full);
      color: var(--gray-400);
      cursor: pointer;
      transition: all var(--transition-fast);
      backdrop-filter: blur(4px);

      &:hover { color: var(--danger-500); transform: scale(1.1); }
      &.is-favorited { color: var(--danger-500); }
    }

    .favorite-btn .material-icons-outlined { font-size: 1.25rem; }

    /* Body */
    .card-body { padding: var(--space-4); }

    .card-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .header-info { flex: 1; min-width: 0; }

    .provider-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .provider-type {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }

    .card-rating {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-3);
    }

    .review-count {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .card-meta {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      margin-bottom: var(--space-3);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .meta-item .material-icons-outlined { font-size: 0.875rem; }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-3);
      border-top: 1px solid var(--border);
    }

    :host-context(.dark) .card-footer { border-color: var(--gray-700); }

    .price-range {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
    }

    :host-context(.dark) .price-range { color: var(--primary-400); }

    .service-count {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }
  `],
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
    this.favoriteChange.emit(this.provider().user._id);
  }
}
