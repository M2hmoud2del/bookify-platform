import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { PopulatedReview } from '../shared/provider.models';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, AvatarComponent, RatingComponent],
  template: `
    <div class="review-list">
      @for (review of reviews(); track review._id) {
        <div class="review-item">
          <div class="review-header">
            <app-avatar
              [src]="review.customer.avatar ?? undefined"
              [name]="review.customer.name"
              size="md"
            />
            <div class="reviewer-info">
              <p class="reviewer-name">{{ review.customer.name }}</p>
              <p class="review-service">{{ review.service.title }}</p>
            </div>
            <div class="review-right">
              <app-rating [value]="review.rating" [readonly]="true" [showValue]="false" />
              <span class="review-date">{{ review.createdAt | date: 'MMM d, y' }}</span>
            </div>
          </div>

          <p class="review-comment">{{ review.comment }}</p>
        </div>
      } @empty {
        <div class="empty-reviews">
          <span class="material-icons-outlined">reviews</span>
          <p>No reviews yet</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .review-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .review-item {
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .review-item {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .review-header {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .reviewer-info { flex: 1; min-width: 0; }

    .reviewer-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .review-service {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .review-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-1);
      flex-shrink: 0;
    }

    .review-date {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    .review-comment {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      line-height: 1.6;
      margin: 0 0 var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      border-left: 3px solid var(--primary-500);
    }

    :host-context(.dark) .review-comment { background: var(--gray-900); }

    .empty-reviews {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-12);
      color: var(--text-secondary);
    }

    .empty-reviews .material-icons-outlined {
      font-size: 2.5rem;
      color: var(--gray-300);
    }

    :host-context(.dark) .empty-reviews .material-icons-outlined { color: var(--gray-600); }
  `],
})
export class ReviewListComponent {
  reviews = input.required<PopulatedReview[]>();
}
