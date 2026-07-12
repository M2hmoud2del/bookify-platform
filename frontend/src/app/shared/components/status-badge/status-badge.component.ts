import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
import {
  AppointmentStatus,
  AppointmentPaymentStatus,
  PaymentStatus,
} from '../../../core/models/user.model';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <app-badge [variant]="badgeVariant()">
      <span class="status-dot" [class]="'dot-' + badgeVariant()"></span>
      {{ label() }}
    </app-badge>
  `,
  styles: [`
    :host { display: inline-flex; }

    .status-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: var(--radius-full);
      margin-right: var(--space-1);
      flex-shrink: 0;
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .dot-success  { background: var(--success-500); }
    .dot-warning  { background: var(--warning-500); }
    .dot-danger   { background: var(--danger-500); }
    .dot-primary  { background: var(--primary-500); }
    .dot-secondary { background: var(--accent-500); }
    .dot-gray     { background: var(--gray-400); animation: none; }
  `],
})
export class StatusBadgeComponent {
  status = input.required<AppointmentStatus | AppointmentPaymentStatus | PaymentStatus>();

  badgeVariant(): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
      pending_payment: 'warning',
      confirmed:       'primary',
      rejected:        'danger',
      cancelled:       'danger',
      completed:       'success',
      unpaid:          'warning',
      paid:            'success',
      refunded:        'gray',
      failed:          'danger',
      pending:         'warning',
    };
    return map[this.status()] ?? 'gray';
  }

  label(): string {
    return this.status()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
