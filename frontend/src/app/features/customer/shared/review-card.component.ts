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
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css',
})
export class ReviewCardComponent {
  review = input.required<PopulatedReview>();
  edit = output<void>();
  delete = output<void>();
}
