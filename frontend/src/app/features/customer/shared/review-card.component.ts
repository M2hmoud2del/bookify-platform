import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ReviewView } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, AvatarComponent, RatingComponent, ButtonComponent],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css',
})
export class ReviewCardComponent {
  review = input.required<ReviewView>();
  edit = output<void>();
  delete = output<void>();
}
