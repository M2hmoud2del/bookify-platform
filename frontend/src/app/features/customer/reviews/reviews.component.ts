import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ReviewCardComponent } from '../shared/review-card.component';
import { ReviewFormComponent } from '../shared/review-form.component';
import { MOCK_REVIEWS, PopulatedReview } from '../shared/customer.models';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    EmptyStateComponent,
    ModalComponent,
    ReviewCardComponent,
    ReviewFormComponent,
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class CustomerReviewsComponent {
  reviews = signal<PopulatedReview[]>(MOCK_REVIEWS);
  showEditModal = signal(false);
  showDeleteModal = signal(false);
  editingReview = signal<PopulatedReview | null>(null);
  deletingReview = signal<PopulatedReview | null>(null);
  submitting = signal(false);

  averageRating = computed(() => {
    const r = this.reviews();
    if (r.length === 0) return '0.0';
    return (r.reduce((sum, x) => sum + x.rating, 0) / r.length).toFixed(1);
  });

  pendingReviews = computed(() => 2);

  openEditModal(review: PopulatedReview): void {
    this.editingReview.set(review);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editingReview.set(null);
  }

  onSubmitEdit(data: { rating: number; comment: string }): void {
    this.submitting.set(true);
    const editing = this.editingReview();
    if (editing) {
      this.reviews.update(list =>
        list.map(r => r._id === editing._id ? { ...r, rating: data.rating, comment: data.comment } : r)
      );
    }
    setTimeout(() => {
      this.submitting.set(false);
      this.closeEditModal();
    }, 500);
  }

  openDeleteModal(review: PopulatedReview): void {
    this.deletingReview.set(review);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingReview.set(null);
  }

  confirmDelete(): void {
    const deleting = this.deletingReview();
    if (deleting) {
      this.reviews.update(list => list.filter(r => r._id !== deleting._id));
    }
    this.closeDeleteModal();
  }
}
