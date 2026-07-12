import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PublicNavbarComponent } from '../../../layouts/public-layout/public-navbar.component';
import { FooterComponent } from '../../../layouts/public-layout/footer.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { getProviderById, getServiceById, PublicProvider } from '../shared/public.models';
import { Service } from '../../../core/models/user.model';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PublicNavbarComponent,
    FooterComponent,
    ButtonComponent,
    AvatarComponent,
    RatingComponent,
    BadgeComponent,
    EmptyStateComponent,
  ],
  template: `
    <app-public-navbar />

    @if (service() && provider()) {
      <div class="service-page">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="breadcrumb">
            <a routerLink="/" class="crumb">Home</a>
            <span class="material-icons-outlined separator">chevron_right</span>
            <a routerLink="/providers" class="crumb">Providers</a>
            <span class="material-icons-outlined separator">chevron_right</span>
            <a [routerLink]="['/providers', provider()!.user._id]" class="crumb">{{ provider()!.profile.businessName }}</a>
            <span class="material-icons-outlined separator">chevron_right</span>
            <span class="crumb crumb-current">{{ service()!.title }}</span>
          </nav>

          <div class="content-grid">
            <!-- Main content -->
            <div class="main-col">
              <!-- Hero image -->
              <div class="hero-image">
                <img [src]="service()!.images[0]?.url" [alt]="service()!.title" />
                <div class="hero-badges">
                  <app-badge variant="primary">{{ service()!.category }}</app-badge>
                  <span class="duration-badge">
                    <span class="material-icons-outlined">schedule</span>
                    {{ service()!.durationMinutes }} minutes
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div class="section">
                <h1 class="service-title">{{ service()!.title }}</h1>
                <p class="service-desc">{{ service()!.description }}</p>
              </div>

              <!-- What's included -->
              <div class="section">
                <h2 class="section-title">What's Included</h2>
                <ul class="includes-list">
                  @for (item of includedItems(); track item) {
                    <li class="include-item">
                      <span class="material-icons-outlined check-icon">check_circle</span>
                      <span>{{ item }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- What to expect -->
              <div class="section">
                <h2 class="section-title">What to Expect</h2>
                <div class="expect-timeline">
                  @for (step of timelineSteps; track step.step) {
                    <div class="timeline-item">
                      <span class="timeline-number">{{ step.step }}</span>
                      <div class="timeline-content">
                        <h3 class="timeline-title">{{ step.title }}</h3>
                        <p class="timeline-desc">{{ step.description }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Reviews for this service -->
              <div class="section">
                <h2 class="section-title">Reviews for this Service</h2>
                @if (serviceReviews().length > 0) {
                  <div class="reviews-list">
                    @for (review of serviceReviews(); track review._id) {
                      <div class="review-card">
                        <div class="review-header">
                          <app-avatar
                            [name]="review.customer"
                            size="md"
                          />
                          <div class="review-meta">
                            <p class="reviewer-name">{{ review.customer }}</p>
                            <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
                          </div>
                          <app-rating [value]="review.rating" [readonly]="true" [showValue]="false" />
                        </div>
                        <p class="review-comment">{{ review.comment }}</p>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="no-reviews">No reviews yet for this service.</p>
                }
              </div>
            </div>

            <!-- Sidebar -->
            <aside class="sidebar">
              <!-- Booking card -->
              <div class="booking-card">
                <div class="booking-price">
                  <span class="price-label">Price</span>
                  <span class="price-value">$ {{ service()!.price }}</span>
                </div>

                <div class="booking-info">
                  <div class="info-row">
                    <span class="material-icons-outlined">schedule</span>
                    <div>
                      <p class="info-label">Duration</p>
                      <p class="info-value">{{ service()!.durationMinutes }} minutes</p>
                    </div>
                  </div>
                  <div class="info-row">
                    <span class="material-icons-outlined">category</span>
                    <div>
                      <p class="info-label">Category</p>
                      <p class="info-value">{{ service()!.category }}</p>
                    </div>
                  </div>
                  <div class="info-row">
                    <span class="material-icons-outlined">payments</span>
                    <div>
                      <p class="info-label">Payment</p>
                      <p class="info-value">Due at booking</p>
                    </div>
                  </div>
                </div>

                <app-button
                  variant="primary"
                  [fullWidth]="true"
                  size="lg"
                  (onClick)="onBook()"
                >
                  <span class="material-icons-outlined">calendar_today</span>
                  Book This Service
                </app-button>

                <p class="booking-note">
                  <span class="material-icons-outlined">verified</span>
                  Free cancellation up to 24 hours before
                </p>
              </div>

              <!-- Provider card -->
              <div class="provider-mini">
                <div class="mini-header">
                  <h3 class="mini-title">About the Provider</h3>
                </div>
                <div class="mini-body">
                  <div class="mini-provider">
                    <app-avatar
                      [src]="provider()!.user.avatar ?? undefined"
                      [name]="provider()!.profile.businessName"
                      size="md"
                    />
                    <div class="mini-info">
                      <p class="mini-name">{{ provider()!.profile.businessName }}</p>
                      <div class="mini-rating">
                        <app-rating [value]="provider()!.profile.ratingAverage" [readonly]="true" [showValue]="true" />
                      </div>
                      <p class="mini-location">
                        <span class="material-icons-outlined">location_on</span>
                        {{ provider()!.profile.city }}
                      </p>
                    </div>
                  </div>
                  <p class="mini-desc">{{ provider()!.profile.bio }}</p>
                  <a [routerLink]="['/providers', provider()!.user._id]" class="view-provider-link">
                    View Full Profile
                    <span class="material-icons-outlined">arrow_forward</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    } @else {
      <div class="container not-found-wrap">
        <app-empty-state
          icon="search_off"
          title="Service not found"
          description="The service you're looking for doesn't exist or has been removed."
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

    .service-page {
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    @media (min-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr 360px;
        align-items: start;
      }
    }

    .main-col {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    /* Hero */
    .hero-image {
      position: relative;
      height: 320px;
      border-radius: var(--radius-2xl);
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .hero-image { height: 400px; }
    }

    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-badges {
      position: absolute;
      bottom: var(--space-4);
      left: var(--space-4);
      display: flex;
      gap: var(--space-2);
      align-items: center;
    }

    .duration-badge {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: var(--space-1) var(--space-3);
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      backdrop-filter: blur(4px);
    }

    .duration-badge .material-icons-outlined { font-size: 1rem; }

    /* Sections */
    .section {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .service-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .service-desc {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
    }

    .section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    /* Includes */
    .includes-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-3);
      list-style: none;
      padding: 0;
      margin: 0;
    }

    @media (min-width: 640px) {
      .includes-list { grid-template-columns: 1fr 1fr; }
    }

    .include-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .check-icon {
      color: var(--success-500);
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    /* Timeline */
    .expect-timeline {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .timeline-item {
      display: flex;
      gap: var(--space-4);
    }

    .timeline-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--primary-100);
      color: var(--primary-600);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      flex-shrink: 0;
    }

    :host-context(.dark) .timeline-number {
      background: rgba(79, 70, 229, 0.15);
      color: var(--primary-400);
    }

    .timeline-content {
      flex: 1;
      padding-top: var(--space-1);
    }

    .timeline-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
    }

    .timeline-desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    /* Reviews */
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .review-card {
      padding: var(--space-4);
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

    .no-reviews {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      padding: var(--space-4);
    }

    /* Sidebar */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      position: sticky;
      top: calc(var(--navbar-height) + var(--space-4));
    }

    /* Booking card */
    .booking-card {
      padding: var(--space-6);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-md);
    }

    :host-context(.dark) .booking-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .booking-price {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
      margin-bottom: var(--space-5);
      padding-bottom: var(--space-5);
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .booking-price { border-color: var(--gray-700); }

    .price-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .price-value {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .booking-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
    }

    .info-row .material-icons-outlined {
      font-size: 1.25rem;
      color: var(--primary-500);
      margin-top: 2px;
    }

    .info-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: var(--font-weight-semibold);
    }

    .info-value {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      margin: 0;
      font-weight: var(--font-weight-medium);
    }

    .booking-note {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      margin: var(--space-4) 0 0;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      justify-content: center;
    }

    .booking-note .material-icons-outlined {
      font-size: 0.875rem;
      color: var(--success-500);
    }

    /* Provider mini */
    .provider-mini {
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
    }

    :host-context(.dark) .provider-mini {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .mini-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-4);
    }

    .mini-provider {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .mini-info { flex: 1; min-width: 0; }

    .mini-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
    }

    .mini-location {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .mini-location .material-icons-outlined { font-size: 0.875rem; }

    .mini-desc {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0 0 var(--space-3);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .view-provider-link {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--primary-600);
      text-decoration: none;
      transition: gap var(--transition-fast);

      &:hover { gap: var(--space-2); text-decoration: underline; }
    }

    :host-context(.dark) .view-provider-link { color: var(--primary-400); }

    .view-provider-link .material-icons-outlined { font-size: 1rem; }

    .not-found-wrap {
      padding: calc(var(--navbar-height) + var(--space-16)) var(--space-4);
      min-height: 60vh;
    }
  `],
})
export class ServiceDetailsComponent {
  private route = inject(ActivatedRoute);
  router = inject(Router);

  provider = computed<PublicProvider | undefined>(() => {
    const id = this.route.snapshot.paramMap.get('providerId');
    return id ? getProviderById(id) : undefined;
  });

  service = computed<Service | undefined>(() => {
    const providerId = this.route.snapshot.paramMap.get('providerId');
    const serviceId = this.route.snapshot.paramMap.get('serviceId');
    if (!providerId || !serviceId) return undefined;
    return getServiceById(providerId, serviceId);
  });

  serviceReviews = computed(() => {
    const p = this.provider();
    const s = this.service();
    if (!p || !s) return [];
    return p.reviews.filter(r => r.service === s._id);
  });

  includedItems = computed(() => {
    const s = this.service();
    if (!s) return [];
    return [
      `Professional ${s.title.toLowerCase()} service`,
      `Full ${s.durationMinutes}-minute session`,
      'All necessary equipment and materials',
      'Expert consultation and advice',
      'Satisfaction guarantee',
    ];
  });

  timelineSteps = [
    { step: 1, title: 'Book Your Slot', description: 'Choose a date and time that works for you from the available slots.' },
    { step: 2, title: 'Confirm Payment', description: 'Securely complete your booking with online payment.' },
    { step: 3, title: 'Attend Your Appointment', description: 'Arrive at the provider\'s location or join online for your session.' },
    { step: 4, title: 'Share Your Experience', description: 'After your appointment, leave a review to help others.' },
  ];

  onBook(): void {
    const p = this.provider();
    if (p) {
      this.router.navigate(['/providers', p.user._id, 'services', this.service()?._id]);
    }
  }
}
