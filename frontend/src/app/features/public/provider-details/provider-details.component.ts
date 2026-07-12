import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PublicNavbarComponent } from '../../../layouts/public-layout/public-navbar.component';
import { FooterComponent } from '../../../layouts/public-layout/footer.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ProviderHeaderComponent } from '../shared/provider-header.component';
import { ProviderAboutComponent } from '../shared/provider-about.component';
import { ServiceListComponent } from '../shared/service-list.component';
import { getProviderById } from '../shared/public.models';

@Component({
  selector: 'app-provider-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PublicNavbarComponent,
    FooterComponent,
    ButtonComponent,
    AvatarComponent,
    RatingComponent,
    EmptyStateComponent,
    ProviderHeaderComponent,
    ProviderAboutComponent,
    ServiceListComponent,
  ],
  template: `
    <app-public-navbar />

    @if (provider()) {
      <div class="provider-page">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="breadcrumb">
            <a routerLink="/" class="crumb">Home</a>
            <span class="material-icons-outlined separator">chevron_right</span>
            <a routerLink="/providers" class="crumb">Providers</a>
            <span class="material-icons-outlined separator">chevron_right</span>
            <span class="crumb crumb-current">{{ provider()!.profile.businessName }}</span>
          </nav>

          <!-- Header -->
          <app-provider-header
            class="header-block"
            [provider]="provider()!"
            (favorite)="toggleFavorite()"
            (book)="scrollToServices()"
          />

          <!-- Tabs -->
          <div class="tabs-bar">
            <button
              type="button"
              class="tab-btn"
              [class.is-active]="activeTab() === 'services'"
              (click)="activeTab.set('services')"
            >
              <span class="material-icons-outlined">spa</span>
              Services
            </button>
            <button
              type="button"
              class="tab-btn"
              [class.is-active]="activeTab() === 'about'"
              (click)="activeTab.set('about')"
            >
              <span class="material-icons-outlined">info</span>
              About
            </button>
            <button
              type="button"
              class="tab-btn"
              [class.is-active]="activeTab() === 'reviews'"
              (click)="activeTab.set('reviews')"
            >
              <span class="material-icons-outlined">reviews</span>
              Reviews
              <span class="tab-badge">{{ provider()!.reviews.length }}</span>
            </button>
          </div>

          <!-- Tab content -->
          <div class="tab-content">
            @if (activeTab() === 'services') {
              <div id="services-section">
                <app-service-list
                  [services]="provider()!.services"
                  [providerId]="provider()!.user._id"
                  (book)="onBookService($event)"
                />
              </div>
            }

            @if (activeTab() === 'about') {
              <app-provider-about [provider]="provider()!" />
            }

            @if (activeTab() === 'reviews') {
              <div class="reviews-section">
                <div class="reviews-header">
                  <h2 class="section-title">Customer Reviews</h2>
                  <div class="rating-summary">
                    <app-rating [value]="provider()!.profile.ratingAverage" [readonly]="true" [showValue]="true" />
                    <span class="total-reviews">{{ provider()!.profile.ratingCount }} total reviews</span>
                  </div>
                </div>

                <div class="reviews-list">
                  @for (review of provider()!.reviews; track review._id) {
                    <div class="review-card">
                      <div class="review-header">
                        <app-avatar
                          [name]="review.customer"
                          size="md"
                        />
                        <div class="review-meta">
                          <p class="reviewer-name">{{ review.customer }}</p>
                          <p class="review-service">{{ serviceName(review.service) }}</p>
                        </div>
                        <div class="review-right">
                          <app-rating [value]="review.rating" [readonly]="true" [showValue]="false" />
                          <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
                        </div>
                      </div>
                      <p class="review-comment">{{ review.comment }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="container not-found-wrap">
        <app-empty-state
          icon="person_off"
          title="Provider not found"
          description="The provider you're looking for doesn't exist or has been removed."
          actionLabel="Browse providers"
          (action)="router.navigate(['/providers'])"
        />
      </div>
    }

    <app-footer />
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: 0 var(--space-4);
    }

    .provider-page {
      padding: calc(var(--navbar-height) + var(--space-6)) 0 var(--space-12);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      margin-bottom: var(--space-5);
      flex-wrap: wrap;
    }

    .crumb {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);

      &:hover { color: var(--primary-500); }
    }

    .crumb-current {
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
    }

    .separator .material-icons-outlined {
      font-size: 1.125rem;
      color: var(--gray-300);
    }

    :host-context(.dark) .separator .material-icons-outlined { color: var(--gray-600); }

    .header-block {
      margin-bottom: var(--space-6);
    }

    /* Tabs */
    .tabs-bar {
      display: flex;
      gap: var(--space-1);
      border-bottom: 2px solid var(--border);
      margin-bottom: var(--space-6);
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar { display: none; }
    }

    :host-context(.dark) .tabs-bar { border-color: var(--gray-700); }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-3) var(--space-4);
      background: none;
      border: none;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      white-space: nowrap;
      transition: all var(--transition-fast);

      &:hover { color: var(--primary-500); }

      &.is-active {
        color: var(--primary-600);
        border-bottom-color: var(--primary-500);
      }
    }

    :host-context(.dark) .tab-btn.is-active { color: var(--primary-400); }

    .tab-btn .material-icons-outlined { font-size: 1.125rem; }

    .tab-badge {
      padding: 0 var(--space-1);
      font-size: var(--font-size-xs);
      background: var(--gray-100);
      border-radius: var(--radius-full);
      min-width: 20px;
      text-align: center;
    }

    :host-context(.dark) .tab-badge {
      background: var(--gray-700);
      color: var(--gray-300);
    }

    .tab-content {
      min-height: 300px;
    }

    /* Reviews */
    .reviews-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .reviews-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .rating-summary {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .total-reviews {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .review-card {
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .review-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .review-meta { flex: 1; }

    .reviewer-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .review-service {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }

    .review-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-1);
    }

    .review-date {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .review-comment {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      line-height: 1.6;
      margin: 0;
    }

    .not-found-wrap {
      padding: calc(var(--navbar-height) + var(--space-16)) var(--space-4);
      min-height: 60vh;
    }
  `],
})
export class ProviderDetailsComponent {
  private route = inject(ActivatedRoute);
  router = inject(Router);

  provider = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? getProviderById(id) : undefined;
  });

  activeTab = signal<'services' | 'about' | 'reviews'>('services');

  toggleFavorite(): void {
    // Favorite state is UI-only in this mock; no backend field to toggle.
  }

  scrollToServices(): void {
    this.activeTab.set('services');
    setTimeout(() => {
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  onBookService(service: any): void {
    const p = this.provider();
    if (p) {
      this.router.navigate(['/providers', p.user._id, 'services', service._id]);
    }
  }

  serviceName(serviceId: string): string {
    const p = this.provider();
    if (!p) return serviceId;
    return p.services.find(s => s._id === serviceId)?.title ?? serviceId;
  }
}
