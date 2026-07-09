import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="empty-state">
      @if (icon()) {
        <div class="empty-state-icon">
          <span class="material-icons-outlined">{{ icon() }}</span>
        </div>
      }

      @if (title()) {
        <h3 class="empty-state-title">{{ title() }}</h3>
      }

      @if (description()) {
        <p class="empty-state-description">{{ description() }}</p>
      }

      @if (actionLabel()) {
        <app-button
          [variant]="actionVariant()"
          (onClick)="action.emit()"
        >
          {{ actionLabel() }}
        </app-button>
      }

      <ng-content />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-12) var(--space-4);
    }

    .empty-state-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: var(--radius-full);
      background: var(--gray-100);
      color: var(--gray-400);
      margin-bottom: var(--space-4);
    }

    :host-context(.dark) .empty-state-icon {
      background: var(--gray-800);
      color: var(--gray-500);
    }

    .empty-state-icon .material-icons-outlined {
      font-size: 2rem;
    }

    .empty-state-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .empty-state-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-2) 0 var(--space-6);
      max-width: 400px;
    }
  `],
})
export class EmptyStateComponent {
  icon = input<string>();
  title = input<string>();
  description = input<string>();
  actionLabel = input<string>();
  actionVariant = input<'primary' | 'secondary' | 'outline' | 'ghost'>('primary');

  action = output<void>();
}
