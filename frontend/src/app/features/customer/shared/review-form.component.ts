import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent, ButtonComponent],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
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
