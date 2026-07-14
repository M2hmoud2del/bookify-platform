import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-provider-reviews',
  standalone: true,
  imports: [CommonModule, CardComponent, AvatarComponent, RatingComponent, ButtonComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ProviderReviewsComponent {
  reviews = [
    { id: '1', customer_name: 'Emma Wilson', rating: 5, comment: 'Amazing service! Will definitely come back.', date: 'Jun 28, 2026' },
    { id: '2', customer_name: 'David Chen', rating: 4, comment: 'Great haircut, very professional.', date: 'Jun 25, 2026' },
    { id: '3', customer_name: 'Sarah Miller', rating: 5, comment: 'Best salon experience ever!', date: 'Jun 20, 2026' },
  ];
}
