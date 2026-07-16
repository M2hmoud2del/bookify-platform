import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { mapBackendReview, mapBackendReviews } from '../../../core/mappers/review.mapper';
import { BackendReview, ProviderReviewsResult, ReviewPayload, ReviewView } from '../../../core/models/review.model';

interface ReviewResponseBody {
  data?: unknown;
  review?: BackendReview;
  reviews?: BackendReview[];
  averageRating?: number;
  totalReviews?: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewsApi {
  private api = inject(ApiService);

  async createReview(payload: ReviewPayload): Promise<ReviewView> {
    const response = await firstValueFrom(this.api.post<unknown>(API_ENDPOINTS.reviews.create, payload));
    return mapBackendReview(this.extractReview(response));
  }

  async getMyReviews(): Promise<ReviewView[]> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.reviews.my));
    return mapBackendReviews(this.extractReviews(response));
  }

  async getProviderReviews(providerId: string): Promise<ProviderReviewsResult> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.reviews.provider(providerId)));
    const body = this.payload(response);
    const reviews = mapBackendReviews(this.extractReviews(response));

    return {
      reviews,
      averageRating: Number(body.averageRating ?? this.averageFromReviews(reviews)),
      totalReviews: Number(body.totalReviews ?? reviews.length),
    };
  }

  async getReviewById(reviewId: string): Promise<ReviewView> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.reviews.byId(reviewId)));
    return mapBackendReview(this.extractReview(response));
  }

  async updateReview(reviewId: string, payload: { rating?: number; comment?: string }): Promise<ReviewView> {
    const response = await firstValueFrom(this.api.put<unknown>(API_ENDPOINTS.reviews.byId(reviewId), payload));
    return mapBackendReview(this.extractReview(response));
  }

  async deleteReview(reviewId: string): Promise<void> {
    await firstValueFrom(this.api.delete<unknown>(API_ENDPOINTS.reviews.byId(reviewId)));
  }

  private extractReview(response: unknown): BackendReview {
    const body = this.payload(response);
    const review = body.review || body;

    if (!review) {
      throw new Error('Review was not returned by the server.');
    }

    return review as BackendReview;
  }

  private extractReviews(response: unknown): BackendReview[] {
    const body = this.payload(response);
    const reviews = body.reviews || body;
    return Array.isArray(reviews) ? reviews as BackendReview[] : [];
  }

  private payload(response: unknown): ReviewResponseBody {
    const body = response as ReviewResponseBody;
    return (body?.data as ReviewResponseBody) || body;
  }

  private averageFromReviews(reviews: ReviewView[]): number {
    if (reviews.length === 0) {
      return 0;
    }

    return Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;
  }
}
