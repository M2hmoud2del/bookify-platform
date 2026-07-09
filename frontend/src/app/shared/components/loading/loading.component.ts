import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="spinner"
      [ngClass]="{
        'spinner-sm': size() === 'sm',
        'spinner-lg': size() === 'lg'
      }"
    ></div>
    @if (text()) {
      <span class="loading-text">{{ text() }}</span>
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--gray-200);
      border-top-color: var(--primary-500);
      border-radius: var(--radius-full);
      animation: spin 0.6s linear infinite;
    }

    :host-context(.dark) .spinner {
      border-color: var(--gray-700);
      border-top-color: var(--primary-400);
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }

    .spinner-lg {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }

    .loading-text {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class LoadingComponent {
  size = input<SpinnerSize>('md');
  text = input<string>();
}
