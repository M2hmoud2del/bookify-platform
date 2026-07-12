import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'rectangular' | 'circle' | 'text' | 'avatar';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="skeleton"
      [class.skeleton-circle]="variant() === 'circle'"
      [class.skeleton-text]="variant() === 'text'"
      [class.skeleton-avatar]="variant() === 'avatar'"
      [style.width]="width()"
      [style.height]="height()"
    ></div>
  `,
  styles: [`
    :host { display: block; }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--gray-100) 25%,
        var(--gray-200) 50%,
        var(--gray-100) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-md);
    }

    :host-context(.dark) .skeleton {
      background: linear-gradient(
        90deg,
        var(--gray-700) 25%,
        var(--gray-600) 50%,
        var(--gray-700) 75%
      );
      background-size: 200% 100%;
    }

    .skeleton-text {
      width: 100%;
      height: 0.875rem;
      border-radius: var(--radius-sm);
    }

    .skeleton-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
    }

    .skeleton-circle {
      border-radius: var(--radius-full);
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `],
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('rectangular');
  width = input<string | undefined>(undefined);
  height = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-card">
      <app-skeleton variant="rectangular" height="120px" />
      <div class="skeleton-card-content">
        <div class="skeleton-header">
          <app-skeleton variant="avatar" />
          <div class="skeleton-title-group">
            <app-skeleton variant="text" width="60%" />
            <app-skeleton variant="text" width="40%" height="0.75rem" />
          </div>
        </div>
        <app-skeleton variant="text" />
        <app-skeleton variant="text" width="80%" />
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    :host-context(.dark) .skeleton-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .skeleton-card-content {
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .skeleton-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .skeleton-title-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      flex: 1;
    }
  `],
})
export class SkeletonCardComponent {}

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-table">
      <div class="skeleton-thead">
        @for (col of columns(); track $index) {
          <app-skeleton variant="text" width="80%" height="0.75rem" />
        }
      </div>
      @for (row of rows(); track $index) {
        <div class="skeleton-row">
          @for (col of columns(); track $index) {
            <div class="skeleton-cell">
              <app-skeleton variant="text" width="60%" height="0.875rem" />
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-table {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    :host-context(.dark) .skeleton-table {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .skeleton-thead {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      background: var(--gray-50);
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .skeleton-thead {
      background: var(--gray-900);
      border-color: var(--gray-700);
    }

    .skeleton-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--space-4);
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--border-light);
    }

    :host-context(.dark) .skeleton-row {
      border-color: var(--gray-800);
    }

    .skeleton-row:last-child {
      border-bottom: none;
    }

    .skeleton-cell {
      display: flex;
      align-items: center;
    }
  `],
})
export class SkeletonTableComponent {
  columns = input(5);
  rows = input(5);
}

@Component({
  selector: 'app-skeleton-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-list">
      @for (item of items(); track $index) {
        <div class="skeleton-list-item">
          <app-skeleton variant="avatar" />
          <div class="skeleton-list-content">
            <app-skeleton variant="text" width="50%" />
            <app-skeleton variant="text" width="30%" height="0.75rem" />
          </div>
          <app-skeleton variant="rectangular" width="60px" height="24px" />
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .skeleton-list-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .skeleton-list-item {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .skeleton-list-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
  `],
})
export class SkeletonListComponent {
  items = input(5);
}
