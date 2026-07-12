import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StatCardComponent,
    ButtonComponent,
    CardComponent,
    AvatarComponent,
    BadgeComponent,
  ],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <div class="header-content">
          <h1 class="page-title">Welcome back, {{ userFirstName() }}</h1>
          <p class="page-subtitle">Here's what's happening with your appointments today.</p>
        </div>
        <app-button variant="primary" routerLink="/customer/book">
          <span class="material-icons-outlined">add</span>
          Book Appointment
        </app-button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <app-stat-card
          icon="event"
          [value]="stats().upcoming.toString()"
          label="Upcoming Appointments"
          [trend]="12"
          color="primary"
        />
        <app-stat-card
          icon="history"
          [value]="stats().completed.toString()"
          label="Completed Sessions"
          [trend]="8"
          color="accent"
        />
        <app-stat-card
          icon="payments"
          [value]="'$' + stats().spent.toString()"
          label="Total Spent"
          [trend]="-5"
          color="success"
        />
      </div>

      <!-- Upcoming Appointments -->
      <app-card title="Upcoming Appointments">
        <div card-header>
          <a routerLink="/customer/appointments" class="view-all-link">View all</a>
        </div>

        <div class="appointments-list">
          @for (appointment of upcomingAppointments(); track appointment.id) {
            <div class="appointment-item">
              <div class="appointment-date">
                <span class="date-day">{{ formatDate(appointment.start_time).day }}</span>
                <span class="date-month">{{ formatDate(appointment.start_time).month }}</span>
              </div>
              <div class="appointment-info">
                <p class="appointment-service">{{ appointment.service_name }}</p>
                <div class="appointment-meta">
                  <app-avatar
                    [src]="appointment.provider_avatar ?? undefined"
                    [name]="appointment.provider_name"
                    size="sm"
                  />
                  <span class="provider-name">{{ appointment.provider_name }}</span>
                  <span class="separator">•</span>
                  <span class="appointment-time">{{ formatDate(appointment.start_time).time }}</span>
                </div>
              </div>
              <app-badge [variant]="getStatusVariant(appointment.status)">
                {{ appointment.status }}
              </app-badge>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="material-icons-outlined empty-icon">event_available</span>
              <p>No upcoming appointments</p>
              <app-button variant="primary" size="sm" routerLink="/customer/book">
                Book Now
              </app-button>
            </div>
          }
        </div>
      </app-card>

      <!-- Recent Activity -->
      <div class="dashboard-grid">
        <app-card title="Recent Appointments">
          <div class="activity-list">
            @for (activity of recentActivity(); track activity.id) {
              <div class="activity-item">
                <div class="activity-icon" [ngClass]="activity.status">
                  <span class="material-icons-outlined">{{ getActivityIcon(activity.status) }}</span>
                </div>
                <div class="activity-content">
                  <p class="activity-title">{{ activity.service_name }}</p>
                  <p class="activity-provider">{{ activity.provider_name }}</p>
                </div>
                <span class="activity-date">{{ formatDate(activity.start_time).short }}</span>
              </div>
            }
          </div>
        </app-card>

        <app-card title="Favorite Providers">
          <div card-header>
            <a routerLink="/customer/book" class="view-all-link">Find more</a>
          </div>
          <div class="providers-list">
            @for (provider of favoriteProviders(); track provider.id) {
              <div class="provider-item">
                <app-avatar
                  [src]="provider.avatar ?? undefined"
                  [name]="provider.name"
                  size="md"
                />
                <div class="provider-info">
                  <p class="provider-name">{{ provider.name }}</p>
                  <p class="provider-type">{{ provider.type }}</p>
                </div>
                <app-button variant="outline" size="sm" [routerLink]="['/customer/book', provider.id]">
                  Book
                </app-button>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .dashboard {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .dashboard-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      margin-bottom: var(--space-2);
    }

    @media (min-width: 640px) {
      .dashboard-header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .view-all-link {
      font-size: var(--font-size-sm);
      color: var(--primary-500);
      text-decoration: none;
    }

    .view-all-link:hover {
      text-decoration: underline;
    }

    .appointments-list {
      display: flex;
      flex-direction: column;
    }

    .appointment-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .appointment-item {
      border-color: var(--gray-700);
    }

    .appointment-item:last-child {
      border-bottom: none;
    }

    .appointment-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-2) var(--space-3);
      background: var(--gray-100);
      border-radius: var(--radius-lg);
      min-width: 56px;
    }

    :host-context(.dark) .appointment-date {
      background: var(--gray-800);
    }

    .date-day {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .date-month {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .appointment-info {
      flex: 1;
      min-width: 0;
    }

    .appointment-service {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0;
    }

    .appointment-meta {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-top: var(--space-1);
    }

    .provider-name {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .separator {
      color: var(--gray-300);
    }

    .appointment-time {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-8);
      text-align: center;
    }

    .empty-icon {
      font-size: 2.5rem;
      color: var(--gray-300);
      margin-bottom: var(--space-2);
    }

    :host-context(.dark) .empty-icon {
      color: var(--gray-600);
    }

    .empty-state p {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--space-4);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    @media (min-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
    }

    .activity-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--gray-100);
    }

    :host-context(.dark) .activity-icon {
      background: var(--gray-800);
    }

    .activity-icon.completed {
      background: var(--success-100);
      color: var(--success-600);
    }

    :host-context(.dark) .activity-icon.completed {
      background: rgba(34, 197, 94, 0.2);
    }

    .activity-icon.cancelled {
      background: var(--danger-100);
      color: var(--danger-600);
    }

    :host-context(.dark) .activity-icon.cancelled {
      background: rgba(239, 68, 68, 0.2);
    }

    .activity-icon .material-icons-outlined {
      font-size: 1.125rem;
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0;
    }

    .activity-provider {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }

    .activity-date {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .providers-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .provider-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .provider-info {
      flex: 1;
      min-width: 0;
    }

    .provider-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0;
    }

    .provider-type {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }
  `],
})
export class CustomerDashboardComponent {
  authService = inject(AuthService);

  userFirstName = () => {
    const user = this.authService.user();
    return user?.name?.split(' ')[0] ?? 'User';
  };

  stats = signal({
    upcoming: 3,
    completed: 12,
    spent: 450,
  });

  upcomingAppointments = signal([
    {
      id: '1',
      service_name: 'Haircut & Styling',
      provider_name: 'Sarah Johnson',
      provider_avatar: null,
      start_time: '2026-07-02T10:00:00',
      status: 'confirmed',
    },
    {
      id: '2',
      service_name: 'Teeth Cleaning',
      provider_name: 'Dr. Michael Chen',
      provider_avatar: null,
      start_time: '2026-07-05T14:30:00',
      status: 'pending',
    },
    {
      id: '3',
      service_name: 'Personal Training Session',
      provider_name: 'Alex Rivera',
      provider_avatar: null,
      start_time: '2026-07-08T09:00:00',
      status: 'confirmed',
    },
  ]);

  recentActivity = signal([
    {
      id: '1',
      service_name: 'Facial Treatment',
      provider_name: 'Blossom Beauty',
      start_time: '2026-06-28T15:00:00',
      status: 'completed',
    },
    {
      id: '2',
      service_name: 'Consultation',
      provider_name: 'Legal Partners',
      start_time: '2026-06-25T11:00:00',
      status: 'completed',
    },
    {
      id: '3',
      service_name: 'Massage Therapy',
      provider_name: 'Wellness Center',
      start_time: '2026-06-20T16:00:00',
      status: 'cancelled',
    },
  ]);

  favoriteProviders = signal([
    {
      id: '1',
      name: 'Sarah Johnson',
      type: 'Hair Stylist',
      avatar: null,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      type: 'Dentist',
      avatar: null,
    },
    {
      id: '3',
      name: 'Alex Rivera',
      type: 'Personal Trainer',
      avatar: null,
    },
  ]);

  formatDate(dateStr: string): { day: string; month: string; time: string; short: string } {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return {
      day: date.getDate().toString(),
      month: months[date.getMonth()],
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  }

  getStatusVariant(status: string): 'success' | 'warning' | 'gray' {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'gray';
    }
  }

  getActivityIcon(status: string): string {
    return status === 'completed' ? 'check_circle' : 'cancel';
  }
}
