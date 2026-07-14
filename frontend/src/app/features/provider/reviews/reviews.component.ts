import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewView } from '../../../core/models/review.model';
import { ReviewListComponent } from '../shared/review-list.component';
import { ReviewsApi } from '../../customer/reviews/reviews.api';
import { ProviderProfileApi } from '../profile/provider-profile.api';

@Component({
  selector: 'app-provider-reviews',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    RatingComponent,
    ReviewListComponent,
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ProviderReviewsComponent {
  private authService = inject(AuthService);
  private reviewsApi = inject(ReviewsApi);
  private providerProfileApi = inject(ProviderProfileApi);

  reviews = signal<ReviewView[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  backendAverageRating = signal<number | null>(null);
  backendTotalReviews = signal<number | null>(null);

  totalReviews = computed(() => this.backendTotalReviews() ?? this.reviews().length);

  averageRatingNum = computed(() => {
    const backendAverage = this.backendAverageRating();
    if (backendAverage !== null) return backendAverage;

    const r = this.reviews();
    if (r.length === 0) return 0;
    return r.reduce((sum, x) => sum + x.rating, 0) / r.length;
  });

  averageRating = computed(() => this.averageRatingNum().toFixed(1));

  fiveStarCount = computed(() => this.reviews().filter(r => r.rating === 5).length);
  oneStarCount = computed(() => this.reviews().filter(r => r.rating === 1).length);

  constructor() {
    void this.loadReviews();
  }

  async loadReviews(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const providerId = await this.resolveProviderId();
      const result = await this.reviewsApi.getProviderReviews(providerId);
      this.reviews.set(result.reviews);
      this.backendAverageRating.set(result.averageRating);
      this.backendTotalReviews.set(result.totalReviews);
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load provider reviews.'));
      this.reviews.set([]);
      this.backendAverageRating.set(null);
      this.backendTotalReviews.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  getDistCount(star: number): number {
    return this.reviews().filter(r => r.rating === star).length;
  }

  getDistPercent(star: number): number {
    const total = this.reviews().length;
    return total > 0 ? (this.getDistCount(star) / total) * 100 : 0;
  }

  private async resolveProviderId(): Promise<string> {
    const currentUserId = this.authService.user()?._id;
    if (currentUserId) {
      return currentUserId;
    }

    const profile = await this.providerProfileApi.getMyProviderProfile();
    return profile.user;
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
