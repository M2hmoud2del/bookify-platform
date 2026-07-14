import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ReviewView } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, AvatarComponent, RatingComponent],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
})
export class ReviewListComponent {
  reviews = input.required<ReviewView[]>();
}
