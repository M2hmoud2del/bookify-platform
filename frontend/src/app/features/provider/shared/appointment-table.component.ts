import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PopulatedAppointment } from '../shared/provider.models';

@Component({
  selector: 'app-appointment-table',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, StatusBadgeComponent],
  template: `
    <div class="table-wrap">
      @if (appointments().length > 0) {
        <table class="apt-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Payment</th>
              <th class="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (apt of appointments(); track apt._id) {
              <tr>
                <td>
                  <div class="customer-cell">
                    <app-avatar
                      [src]="apt.customer.avatar ?? undefined"
                      [name]="apt.customer.name"
                      size="sm"
                    />
                    <div class="customer-info">
                      <span class="customer-name">{{ apt.customer.name }}</span>
                      <span class="customer-email">{{ apt.customer.email }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="service-name">{{ apt.service.title }}</span>
                </td>
                <td>
                  <div class="date-cell">
                    <span class="date-text">{{ formatDate(apt.localDate) }}</span>
                    <span class="time-text">{{ formatTime(apt.startTime) }}</span>
                  </div>
                </td>
                <td>
                  <span class="duration-text">{{ apt.service.durationMinutes }} min</span>
                </td>
                <td>
                  <span class="price-text">$ {{ apt.service.price }}</span>
                </td>
                <td>
                  <app-status-badge [status]="apt.status" />
                </td>
                <td>
                  <app-status-badge [status]="apt.paymentStatus" />
                </td>
                <td>
                  <div class="actions">
                    <button
                      type="button"
                      class="action-btn"
                      [routerLink]="['/provider/appointments', apt._id]"
                      title="View Details"
                    >
                      <span class="material-icons-outlined">visibility</span>
                    </button>
                    @if (canConfirm(apt.status)) {
                      <button
                        type="button"
                        class="action-btn confirm"
                        (click)="confirm.emit(apt._id)"
                        title="Confirm"
                      >
                        <span class="material-icons-outlined">check</span>
                      </button>
                    }
                    @if (canCancel(apt.status)) {
                      <button
                        type="button"
                        class="action-btn cancel"
                        (click)="cancel.emit(apt._id)"
                        title="Cancel"
                      >
                        <span class="material-icons-outlined">close</span>
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="empty-state">
          <span class="material-icons-outlined">event_busy</span>
          <p>No appointments found</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .table-wrap {
      overflow-x: auto;
      border-radius: var(--radius-xl);
      border: 1px solid var(--border);
      background: var(--surface);
    }

    :host-context(.dark) .table-wrap {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .apt-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .apt-table th {
      padding: var(--space-3) var(--space-4);
      text-align: left;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
      background: var(--gray-50);
      white-space: nowrap;
    }

    :host-context(.dark) .apt-table th {
      background: var(--gray-900);
      border-color: var(--gray-700);
    }

    .apt-table td {
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    :host-context(.dark) .apt-table td { border-color: var(--gray-700); }

    .apt-table tbody tr:last-child td { border-bottom: none; }

    .apt-table tbody tr:hover { background: var(--gray-50); }
    :host-context(.dark) .apt-table tbody tr:hover { background: var(--gray-900); }

    .customer-cell {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .customer-info {
      display: flex;
      flex-direction: column;
    }

    .customer-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .customer-email {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .service-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .date-cell {
      display: flex;
      flex-direction: column;
    }

    .date-text {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .time-text {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .duration-text, .price-text {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .price-text { font-weight: var(--font-weight-semibold); }

    .actions {
      display: flex;
      gap: var(--space-1);
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--gray-50);
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .action-btn { background: var(--gray-700); }

    .action-btn:hover { background: var(--primary-100); color: var(--primary-600); }
    :host-context(.dark) .action-btn:hover { background: rgba(79, 70, 229, 0.15); color: var(--primary-400); }

    .action-btn.confirm:hover { background: var(--success-100); color: var(--success-600); }
    .action-btn.cancel:hover { background: var(--danger-100); color: var(--danger-600); }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-12);
      color: var(--text-secondary);
    }

    .empty-state .material-icons-outlined {
      font-size: 2.5rem;
      color: var(--gray-300);
    }

    @media (max-width: 768px) {
      .actions-col { display: none; }
    }
  `],
})
export class AppointmentTableComponent {
  appointments = input.required<PopulatedAppointment[]>();
  confirm = output<string>();
  cancel = output<string>();

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTime(timeStr: string): string {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  }

  canConfirm(status: string): boolean {
    return status === 'pending_payment';
  }

  canCancel(status: string): boolean {
    return status === 'confirmed' || status === 'pending_payment';
  }
}
