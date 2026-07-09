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
  template: `
    <div class="reviews-page">
      <div class="page-header">
        <h1 class="page-title">Reviews</h1>
        <p class="page-subtitle">Manage customer reviews and feedback</p>
      </div>
      <app-card>
        <div class="reviews-list">
          @for (review of reviews; track review.id) {
            <div class="review-item">
              <div class="review-header">
                <app-avatar [name]="review.customer_name" size="sm" />
                <div class="reviewer-info">
                  <span class="reviewer-name">{{ review.customer_name }}</span>
                  <span class="review-date">{{ review.date }}</span>
                </div>
                <app-rating [value]="review.rating" [readonly]="true" />
              </div>
              <p class="review-comment">{{ review.comment }}</p>
              <div class="review-actions">
                <app-button variant="ghost" size="sm">Respond</app-button>
              </div>
            </div>
          }
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .reviews-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .reviews-list { display: flex; flex-direction: column; }
    .review-item { padding: var(--space-4); border-bottom: 1px solid var(--border); }
    .review-header { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3); }
    .reviewer-info { flex: 1; }
    .reviewer-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); display: block; }
    .review-date { font-size: var(--font-size-xs); color: var(--text-tertiary); }
    .review-comment { font-size: var(--font-size-sm); color: var(--text-secondary); margin: 0 0 var(--space-3); line-height: var(--line-height-relaxed); }
    .review-actions { display: flex; justify-content: flex-end; }
  `],
})
export class ProviderReviewsComponent {
  reviews = [
    { id: '1', customer_name: 'Emma Wilson', rating: 5, comment: 'Amazing service! Will definitely come back.', date: 'Jun 28, 2026' },
    { id: '2', customer_name: 'David Chen', rating: 4, comment: 'Great haircut, very professional.', date: 'Jun 25, 2026' },
    { id: '3', customer_name: 'Sarah Miller', rating: 5, comment: 'Best salon experience ever!', date: 'Jun 20, 2026' },
  ];
}
