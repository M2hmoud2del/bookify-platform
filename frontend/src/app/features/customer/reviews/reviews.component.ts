import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [CommonModule, CardComponent, RatingComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class CustomerReviewsComponent {}
