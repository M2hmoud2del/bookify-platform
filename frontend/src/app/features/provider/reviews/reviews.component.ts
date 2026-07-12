import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ReviewListComponent } from '../shared/review-list.component';
import { MOCK_PROVIDER_REVIEWS, PopulatedReview } from '../shared/provider.models';

@Component({
  selector: 'app-provider-reviews',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    RatingComponent,
    ReviewListComponent,
  ],
  template: `
    <div class="reviews-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Reviews</h1>
          <p class="page-subtitle">View customer reviews and feedback</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ averageRating() }}</span>
          <span class="stat-label">Average Rating</span>
          <app-rating [value]="averageRatingNum()" [readonly]="true" [showValue]="false" />
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalReviews() }}</span>
          <span class="stat-label">Total Reviews</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ fiveStarCount() }}</span>
          <span class="stat-label">5-Star Reviews</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ oneStarCount() }}</span>
          <span class="stat-label">1-Star Reviews</span>
        </div>
      </div>

      <!-- Rating Distribution -->
      <app-card title="Rating Distribution">
        <div class="distribution">
          @for (star of [5,4,3,2,1]; track star) {
            <div class="dist-row">
              <span class="dist-label">{{ star }} star</span>
              <div class="dist-bar-wrap">
                <div class="dist-bar" [style.width.%]="getDistPercent(star)"></div>
              </div>
              <span class="dist-count">{{ getDistCount(star) }}</span>
            </div>
          }
        </div>
      </app-card>

      <!-- Reviews List -->
      <app-card>
        <div card-header>
          <h2 class="card-title">All Reviews</h2>
        </div>
        <app-review-list [reviews]="reviews()" />
      </app-card>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .reviews-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .page-header { margin-bottom: var(--space-2); }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }

    @media (min-width: 768px) {
      .stats-row { grid-template-columns: repeat(4, 1fr); }
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .stat-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .stat-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
    }

    :host-context(.dark) .stat-value { color: var(--primary-400); }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .distribution {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .dist-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .dist-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      min-width: 60px;
    }

    .dist-bar-wrap {
      flex: 1;
      height: 8px;
      background: var(--gray-100);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    :host-context(.dark) .dist-bar-wrap { background: var(--gray-700); }

    .dist-bar {
      height: 100%;
      background: var(--warning-500);
      border-radius: var(--radius-full);
      transition: width var(--transition-normal);
    }

    .dist-count {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      min-width: 24px;
      text-align: right;
    }

    .card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }
  `],
})
export class ProviderReviewsComponent {
  reviews = signal<PopulatedReview[]>(MOCK_PROVIDER_REVIEWS);

  totalReviews = computed(() => this.reviews().length);

  averageRatingNum = computed(() => {
    const r = this.reviews();
    if (r.length === 0) return 0;
    return r.reduce((sum, x) => sum + x.rating, 0) / r.length;
  });

  averageRating = computed(() => this.averageRatingNum().toFixed(1));

  fiveStarCount = computed(() => this.reviews().filter(r => r.rating === 5).length);
  oneStarCount = computed(() => this.reviews().filter(r => r.rating === 1).length);

  getDistCount(star: number): number {
    return this.reviews().filter(r => r.rating === star).length;
  }

  getDistPercent(star: number): number {
    const total = this.reviews().length;
    return total > 0 ? (this.getDistCount(star) / total) * 100 : 0;
  }
}
