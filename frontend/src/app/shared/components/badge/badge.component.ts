import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="badge"
      [ngClass]="{
        'badge-primary': variant() === 'primary',
        'badge-success': variant() === 'success',
        'badge-warning': variant() === 'warning',
        'badge-danger': variant() === 'danger',
        'badge-gray': variant() === 'gray'
      }"
    >
      <ng-content />
    </span>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      border-radius: var(--radius-md);
      white-space: nowrap;
    }

    .badge-primary {
      background: var(--primary-100);
      color: var(--primary-700);
    }

    :host-context(.dark) .badge-primary {
      background: rgba(79, 70, 229, 0.2);
      color: var(--primary-300);
    }

    .badge-success {
      background: var(--success-100);
      color: var(--success-700);
    }

    :host-context(.dark) .badge-success {
      background: rgba(34, 197, 94, 0.2);
      color: var(--success-500);
    }

    .badge-warning {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    :host-context(.dark) .badge-warning {
      background: rgba(245, 158, 11, 0.2);
      color: var(--warning-500);
    }

    .badge-danger {
      background: var(--danger-100);
      color: var(--danger-700);
    }

    :host-context(.dark) .badge-danger {
      background: rgba(239, 68, 68, 0.2);
      color: var(--danger-500);
    }

    .badge-gray {
      background: var(--gray-100);
      color: var(--gray-600);
    }

    :host-context(.dark) .badge-gray {
      background: var(--gray-700);
      color: var(--gray-300);
    }
  `],
})
export class BadgeComponent {
  variant = input<BadgeVariant>('gray');
}
