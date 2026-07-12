import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PopulatedReview } from '../shared/customer.models';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, RatingComponent, ButtonComponent],
  template: `
    <div class="review-card">
      <div class="review-header">
        <div class="review-provider">
          <app-avatar
            [src]="review().provider.avatar ?? undefined"
            [name]="review().provider.name"
            size="md"
          />
          <div class="provider-info">
            <h3 class="provider-name">{{ review().provider.name }}</h3>
            <p class="service-name">{{ review().service.title }}</p>
          </div>
        </div>

        <div class="review-meta">
          <app-rating [value]="review().rating" [readonly]="true" [showValue]="false" />
          <span class="review-date">{{ review().createdAt | date: 'MMM d, y' }}</span>
        </div>
      </div>

      <p class="review-comment">{{ review().comment }}</p>

      <div class="review-footer">
        <div class="rating-display">
          <span class="rating-label">Rating:</span>
          <span class="rating-value">{{ review().rating }} / 5</span>
        </div>
        <div class="review-actions">
          <app-button variant="ghost" size="sm" (onClick)="edit.emit()">
            <span class="material-icons-outlined">edit</span>
            Edit
          </app-button>
          <app-button variant="ghost" size="sm" (onClick)="delete.emit()">
            <span class="material-icons-outlined">delete</span>
            Delete
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .review-card {
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      transition: box-shadow var(--transition-fast);

      &:hover { box-shadow: var(--shadow-sm); }
    }

    :host-context(.dark) .review-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .review-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
    }

    .review-provider {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 1;
      min-width: 0;
    }

    .provider-info { min-width: 0; }

    .provider-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .service-name {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .review-meta {
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
      margin: 0 0 var(--space-4);
      padding: var(--space-3) var(--space-4);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      border-left: 3px solid var(--primary-500);
    }

    :host-context(.dark) .review-comment {
      background: var(--gray-900);
    }

    .review-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .rating-display {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .rating-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .rating-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
    }

    :host-context(.dark) .rating-value { color: var(--primary-400); }

    .review-actions {
      display: flex;
      gap: var(--space-1);
    }
  `],
})
export class ReviewCardComponent {
  review = input.required<PopulatedReview>();
  edit = output<void>();
  delete = output<void>();
}
