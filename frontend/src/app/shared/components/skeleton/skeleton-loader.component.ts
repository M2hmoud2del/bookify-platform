import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  template: `
    <div class="skeleton-loader">
      @if (type() === 'card') {
        <div class="loader-cards">
          @for (card of cards(); track $index) {
            <app-skeleton-card />
          }
        </div>
      } @else if (type() === 'list') {
        <div class="loader-list">
          @for (item of cards(); track $index) {
            <div class="loader-list-item">
              <app-skeleton variant="avatar" />
              <div class="loader-list-content">
                <app-skeleton variant="text" width="50%" />
                <app-skeleton variant="text" width="30%" height="0.75rem" />
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="loader-lines">
          @for (line of cards(); track $index) {
            <app-skeleton variant="text" [width]="randomWidth()" />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .loader-cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .loader-cards { grid-template-columns: repeat(2, 1fr); }
    }

    @media (min-width: 1024px) {
      .loader-cards { grid-template-columns: repeat(3, 1fr); }
    }

    .loader-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .loader-list-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .loader-list-item {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .loader-list-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .loader-lines {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
  `],
})
export class SkeletonLoaderComponent {
  type = input<'card' | 'list' | 'text'>('card');
  count = input(3);

  cards = () => Array.from({ length: this.count() }, (_, i) => i);

  randomWidth(): string {
    const widths = ['100%', '90%', '80%', '70%', '60%', '50%'];
    return widths[Math.floor(Math.random() * widths.length)];
  }
}
