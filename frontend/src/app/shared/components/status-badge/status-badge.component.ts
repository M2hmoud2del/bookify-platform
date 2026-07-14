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
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
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
