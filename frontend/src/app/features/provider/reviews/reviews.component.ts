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
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
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
