import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PopulatedAppointment } from '../shared/customer.models';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, StatusBadgeComponent, ButtonComponent],
  template: `
    <div class="appointment-card" [routerLink]="['/customer/appointments', appointment()._id]">
      <div class="card-date">
        <span class="date-day">{{ dayNumber() }}</span>
        <span class="date-month">{{ monthName() }}</span>
      </div>

      <div class="card-body">
        <div class="card-main">
          <div class="card-provider">
            <app-avatar
              [src]="appointment().provider.avatar ?? undefined"
              [name]="appointment().provider.name"
              size="sm"
            />
            <div class="provider-info">
              <h3 class="service-name">{{ appointment().service.title }}</h3>
              <p class="provider-name">{{ appointment().provider.name }}</p>
            </div>
          </div>

          <div class="card-meta">
            <span class="meta-item">
              <span class="material-icons-outlined">schedule</span>
              {{ formattedTime() }}
            </span>
            <span class="meta-item">
              <span class="material-icons-outlined">location_on</span>
              {{ appointment().service.category }}
            </span>
          </div>
        </div>

        <div class="card-aside">
          <div class="aside-top">
            <app-status-badge [status]="appointment().status" />
            <app-status-badge [status]="appointment().paymentStatus" />
          </div>
          <span class="price">$ {{ appointment().service.price }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .appointment-card {
      display: flex;
      gap: var(--space-4);
      padding: var(--space-4);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-decoration: none;
      color: inherit;

      &:hover {
        border-color: var(--primary-200);
        box-shadow: var(--shadow-sm);
        transform: translateY(-2px);
      }
    }

    :host-context(.dark) .appointment-card {
      background: var(--gray-800);
      border-color: var(--gray-700);

      &:hover {
        border-color: var(--primary-500);
        box-shadow: var(--shadow-md);
      }
    }

    .card-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3);
      background: var(--primary-50);
      border-radius: var(--radius-lg);
      min-width: 60px;
      flex-shrink: 0;
    }

    :host-context(.dark) .card-date {
      background: rgba(79, 70, 229, 0.15);
    }

    .date-day {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
      line-height: 1;
    }

    :host-context(.dark) .date-day { color: var(--primary-400); }

    .date-month {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--primary-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: var(--space-1);
    }

    .card-body {
      flex: 1;
      display: flex;
      justify-content: space-between;
      gap: var(--space-4);
      min-width: 0;
    }

    .card-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      min-width: 0;
    }

    .card-provider {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .provider-info { min-width: 0; }

    .service-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .provider-name {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .meta-item .material-icons-outlined { font-size: 0.875rem; }

    .card-aside {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--space-2);
      flex-shrink: 0;
    }

    .aside-top {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      align-items: flex-end;
    }

    .price {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    @media (max-width: 639px) {
      .card-body { flex-direction: column; }
      .card-aside {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .aside-top { flex-direction: row; gap: var(--space-2); }
    }
  `],
})
export class AppointmentCardComponent {
  appointment = input.required<PopulatedAppointment>();
  cancel = output<string>();
  reschedule = output<string>();

  dayNumber(): string {
    return new Date(this.appointment().localDate).getDate().toString().padStart(2, '0');
  }

  monthName(): string {
    return new Date(this.appointment().localDate).toLocaleDateString('en-US', { month: 'short' });
  }

  formattedTime(): string {
    const [h, m] = this.appointment().startTime.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  }
}
