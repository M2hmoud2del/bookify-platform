import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent, ButtonComponent],
  template: `
    <div class="review-form-wrap">
      <div class="form-header">
        <h3 class="form-title">
          @if (isEditMode()) { Edit Your Review } @else { Write a Review }
        </h3>
        <p class="form-subtitle">Share your experience to help others</p>
      </div>

      <form class="review-form" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label class="field-label">Your Rating</label>
          <div class="rating-row">
            <app-rating
              [value]="rating()"
              (valueChange)="onRatingChange($event)"
            />
            <span class="rating-text">{{ ratingLabel() }}</span>
          </div>
          @if (ratingError()) {
            <p class="field-error">Please select a rating</p>
          }
        </div>

        <div class="form-field">
          <label class="field-label" for="comment">Your Review</label>
          <textarea
            id="comment"
            class="comment-input"
            [(ngModel)]="comment"
            name="comment"
            rows="4"
            placeholder="Tell others about your experience..."
            maxlength="500"
          ></textarea>
          <div class="char-count">{{ comment.length }} / 500</div>
          @if (commentError()) {
            <p class="field-error">Please write a review (minimum 10 characters)</p>
          }
        </div>

        <div class="form-actions">
          <app-button variant="outline" type="button" (onClick)="cancel.emit()">
            Cancel
          </app-button>
          <app-button variant="primary" type="submit" [loading]="submitting()">
            {{ isEditMode() ? 'Update Review' : 'Submit Review' }}
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .review-form-wrap {
      padding: var(--space-6);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
    }

    :host-context(.dark) .review-form-wrap {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .form-header { margin-bottom: var(--space-5); }

    .form-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
    }

    .form-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .review-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .field-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .rating-text {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--primary-600);
    }

    :host-context(.dark) .rating-text { color: var(--primary-400); }

    .comment-input {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      resize: vertical;
      outline: none;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      font-family: inherit;

      &:focus {
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px var(--primary-100);
      }

      &::placeholder { color: var(--gray-400); }
    }

    :host-context(.dark) .comment-input {
      background: var(--gray-900);
      border-color: var(--gray-700);
      color: var(--gray-100);
    }

    .char-count {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      text-align: right;
    }

    .field-error {
      font-size: var(--font-size-xs);
      color: var(--danger-600);
      margin: 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      padding-top: var(--space-2);
    }
  `],
})
export class ReviewFormComponent {
  isEditMode = input(false);
  initialRating = input(0);
  initialComment = input('');
  submitting = input(false);

  submit = output<{ rating: number; comment: string }>();
  cancel = output<void>();

  rating = signal(0);
  comment = '';
  ratingError = signal(false);
  commentError = signal(false);

  constructor() {
    this.rating.set(this.initialRating());
    this.comment = this.initialComment();
  }

  ratingLabel(): string {
    const labels: Record<number, string> = {
      0: 'Select rating',
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return labels[this.rating()] ?? '';
  }

  onRatingChange(val: number): void {
    this.rating.set(val);
    this.ratingError.set(false);
  }

  onSubmit(): void {
    let valid = true;
    if (this.rating() === 0) {
      this.ratingError.set(true);
      valid = false;
    }
    if (this.comment.trim().length < 10) {
      this.commentError.set(true);
      valid = false;
    }
    if (!valid) return;

    this.submit.emit({ rating: this.rating(), comment: this.comment.trim() });
  }
}
