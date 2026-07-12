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
  template: `
    <div class="reviews-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Reviews</h1>
          <p class="page-subtitle">Manage reviews you've written</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ reviews().length }}</span>
          <span class="stat-label">Total Reviews</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ averageRating() }}</span>
          <span class="stat-label">Average Rating</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ pendingReviews() }}</span>
          <span class="stat-label">Pending Reviews</span>
        </div>
      </div>

      <!-- Reviews list -->
      @if (reviews().length > 0) {
        <div class="reviews-list">
          @for (review of reviews(); track review._id) {
            <app-review-card
              [review]="review"
              (edit)="openEditModal(review)"
              (delete)="openDeleteModal(review)"
            />
          }
        </div>
      } @else {
        <app-empty-state
          icon="rate_review"
          title="No reviews yet"
          description="Share your experience by writing reviews for completed appointments."
          actionLabel="View Appointments"
          [routerLink]="['/customer/appointments']"
        />
      }
    </div>

    <!-- Edit Modal -->
    <app-modal
      [isOpen]="showEditModal()"
      title="Edit Review"
      size="md"
      [showFooter]="false"
      (close)="closeEditModal()"
    >
      <app-review-form
        [isEditMode]="true"
        [initialRating]="editingReview()?.rating ?? 0"
        [initialComment]="editingReview()?.comment ?? ''"
        [submitting]="submitting()"
        (submit)="onSubmitEdit($event)"
        (cancel)="closeEditModal()"
      />
    </app-modal>

    <!-- Delete Modal -->
    <app-modal
      [isOpen]="showDeleteModal()"
      title="Delete Review"
      icon="delete"
      size="sm"
      confirmText="Delete"
      confirmVariant="danger"
      (close)="closeDeleteModal()"
      (confirm)="confirmDelete()"
    >
      <p class="delete-message">
        Are you sure you want to delete this review? This action cannot be undone.
      </p>
    </app-modal>
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
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
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

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .delete-message {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
    }
  `],
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
