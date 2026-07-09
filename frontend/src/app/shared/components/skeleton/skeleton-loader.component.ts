import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="skeleton"
      [ngClass]="{
        'skeleton-circle': variant() === 'circle',
        'skeleton-text': variant() === 'text',
        'skeleton-avatar': variant() === 'avatar'
      }"
      [style.width]="width()"
      [style.height]="height()"
    ></div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .skeleton {
      background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-md);
    }

    :host-context(.dark) .skeleton {
      background: linear-gradient(90deg, var(--gray-700) 25%, var(--gray-600) 50%, var(--gray-700) 75%);
      background-size: 200% 100%;
    }

    .skeleton-text {
      width: 100%;
      height: 1rem;
    }

    .skeleton-avatar {
      width: 40px;
      height: 40px;
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
  variant = input<'rectangular' | 'circle' | 'text' | 'avatar'>('rectangular');
  width = input<string>();
  height = input<string>();
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
