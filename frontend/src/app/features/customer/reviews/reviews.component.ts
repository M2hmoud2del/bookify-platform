import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ReviewView } from '../../../core/models/review.model';
import { ReviewCardComponent } from '../shared/review-card.component';
import { ReviewFormComponent } from '../shared/review-form.component';
import { ReviewsApi } from './reviews.api';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EmptyStateComponent,
    ModalComponent,
    ReviewCardComponent,
    ReviewFormComponent,
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class CustomerReviewsComponent {
  private reviewsApi = inject(ReviewsApi);

  reviews = signal<ReviewView[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  editingReview = signal<ReviewView | null>(null);
  deletingReview = signal<ReviewView | null>(null);
  submitting = signal(false);

  averageRating = computed(() => {
    const r = this.reviews();
    if (r.length === 0) return '0.0';
    return (r.reduce((sum, x) => sum + x.rating, 0) / r.length).toFixed(1);
  });

  pendingReviews = computed(() => 0);

  constructor() {
    void this.loadReviews();
  }

  async loadReviews(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.reviews.set(await this.reviewsApi.getMyReviews());
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load your reviews.'));
      this.reviews.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  openEditModal(review: ReviewView): void {
    this.editingReview.set(review);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editingReview.set(null);
  }

  async onSubmitEdit(data: { rating: number; comment: string }): Promise<void> {
    const review = this.editingReview();
    if (!review) return;

    this.submitting.set(true);
    this.error.set(null);

    try {
      const updated = await this.reviewsApi.updateReview(review._id, data);
      this.reviews.update((list) =>
        list.map((r) => (r._id === updated._id ? updated : r))
      );
      this.closeEditModal();
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to update review.'));
    } finally {
      this.submitting.set(false);
    }
  }

  openDeleteModal(review: ReviewView): void {
    this.deletingReview.set(review);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingReview.set(null);
  }

  async confirmDelete(): Promise<void> {
    const review = this.deletingReview();
    if (!review) return;

    this.error.set(null);

    try {
      await this.reviewsApi.deleteReview(review._id);
      this.reviews.update((list) => list.filter((r) => r._id !== review._id));
      this.closeDeleteModal();
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to delete review.'));
      this.closeDeleteModal();
    }
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
