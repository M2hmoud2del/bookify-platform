import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [CommonModule, CardComponent, RatingComponent],
  template: `
    <div class="reviews-page">
      <div class="page-header">
        <h1 class="page-title">My Reviews</h1>
        <p class="page-subtitle">Manage reviews you've written</p>
      </div>
      <app-card>
        <div class="reviews-list">
          <div class="review-item">
            <div class="review-header">
              <h3 class="provider-name">Blossom Beauty Salon</h3>
              <app-rating [value]="5" [readonly]="true" />
            </div>
            <p class="review-comment">Amazing service! Will definitely come back.</p>
            <p class="review-date">Jun 28, 2026</p>
          </div>
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
    .review-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2); }
    .provider-name { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); color: var(--text-primary); margin: 0; }
    .review-comment { font-size: var(--font-size-sm); color: var(--text-secondary); margin: 0 0 var(--space-2); line-height: var(--line-height-relaxed); }
    .review-date { font-size: var(--font-size-xs); color: var(--text-tertiary); margin: 0; }
  `],
})
export class CustomerReviewsComponent {}
