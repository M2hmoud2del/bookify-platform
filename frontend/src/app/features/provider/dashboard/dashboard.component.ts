import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-provider-dashboard',
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
          <p class="page-subtitle">Here's your business overview for today.</p>
        </div>
        <app-button variant="primary" routerLink="/provider/calendar">
          <span class="material-icons-outlined">calendar_today</span>
          View Calendar
        </app-button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <app-stat-card
          icon="event"
          [value]="stats().todayAppointments.toString()"
          label="Today's Appointments"
          [trend]="15"
          color="primary"
        />
        <app-stat-card
          icon="attach_money"
          [value]="'$' + stats().monthlyRevenue.toString()"
          label="Monthly Revenue"
          [trend]="23"
          color="success"
        />
        <app-stat-card
          icon="star"
          [value]="stats().rating.toString()"
          label="Average Rating"
          [trend]="5"
          color="accent"
        />
        <app-stat-card
          icon="people"
          [value]="stats().totalCustomers.toString()"
          label="Total Customers"
          [trend]="12"
          color="primary"
        />
      </div>

      <!-- Today's Schedule -->
      <app-card title="Today's Schedule">
        <div card-header>
          <span class="today-date">{{ todayDateString() }}</span>
        </div>
        <div class="schedule-timeline">
          @for (appointment of todayAppointments(); track appointment.id) {
            <div class="timeline-item">
              <div class="timeline-time">
                <span class="time-start">{{ formatTime(appointment.start_time) }}</span>
                <span class="time-end">{{ formatTime(appointment.end_time) }}</span>
              </div>
              <div class="timeline-marker" [ngClass]="appointment.status">
                <span class="marker-dot"></span>
                <span class="marker-line"></span>
              </div>
              <div class="timeline-content">
                <div class="appointment-card">
                  <div class="appointment-header">
                    <p class="appointment-service">{{ appointment.service_name }}</p>
                    <app-badge [variant]="getStatusVariant(appointment.status)" size="sm">
                      {{ appointment.status }}
                    </app-badge>
                  </div>
                  <div class="appointment-customer">
                    <app-avatar
                      [src]="appointment.customer_avatar ?? undefined"
                      [name]="appointment.customer_name"
                      size="sm"
                    />
                    <span>{{ appointment.customer_name }}</span>
                  </div>
                  <p class="appointment-notes" *ngIf="appointment.notes">{{ appointment.notes }}</p>
                </div>
              </div>
            </div>
          } @empty {
            <div class="empty-schedule">
              <span class="material-icons-outlined">event_available</span>
              <p>No appointments scheduled for today</p>
            </div>
          }
        </div>
      </app-card>

      <!-- Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Recent Reviews -->
        <app-card title="Recent Reviews">
          <div card-header>
            <a routerLink="/provider/reviews" class="view-all-link">View all</a>
          </div>
          <div class="reviews-list">
            @for (review of recentReviews(); track review.id) {
              <div class="review-item">
                <div class="review-header">
                  <app-avatar
                    [src]="review.customer_avatar ?? undefined"
                    [name]="review.customer_name"
                    size="sm"
                  />
                  <div class="review-meta">
                    <p class="customer-name">{{ review.customer_name }}</p>
                    <div class="review-rating">
                      @for (star of [1,2,3,4,5]; track star) {
                        <span class="material-icons-outlined star" [ngClass]="{ 'filled': star <= review.rating }">
                          {{ star <= review.rating ? 'star' : 'star_border' }}
                        </span>
                      }
                    </div>
                  </div>
                </div>
                <p class="review-comment">{{ review.comment }}</p>
              </div>
            }
          </div>
        </app-card>

        <!-- Quick Stats -->
        <app-card title="This Week">
          <div class="week-stats">
            <div class="week-stat">
              <div class="stat-icon completed">
                <span class="material-icons-outlined">check_circle</span>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ weekStats().completed }}</span>
                <span class="stat-label">Completed</span>
              </div>
            </div>
            <div class="week-stat">
              <div class="stat-icon upcoming">
                <span class="material-icons-outlined">schedule</span>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ weekStats().upcoming }}</span>
                <span class="stat-label">Upcoming</span>
              </div>
            </div>
            <div class="week-stat">
              <div class="stat-icon cancelled">
                <span class="material-icons-outlined">cancel</span>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ weekStats().cancelled }}</span>
                <span class="stat-label">Cancelled</span>
              </div>
            </div>
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
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .today-date {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .schedule-timeline {
      display: flex;
      flex-direction: column;
    }

    .timeline-item {
      display: flex;
      gap: var(--space-4);
      padding: var(--space-4) 0;
    }

    .timeline-time {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      min-width: 60px;
    }

    .time-start {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .time-end {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .marker-dot {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-full);
      background: var(--primary-500);
      border: 2px solid var(--primary-100);
    }

    :host-context(.dark) .marker-dot {
      border-color: rgba(79, 70, 229, 0.3);
    }

    .marker-line {
      flex: 1;
      width: 2px;
      background: var(--gray-200);
      margin-top: 4px;
    }

    :host-context(.dark) .marker-line {
      background: var(--gray-700);
    }

    .timeline-marker.completed .marker-dot {
      background: var(--success-500);
      border-color: var(--success-100);
    }

    .timeline-marker.in_progress .marker-dot {
      background: var(--warning-500);
      border-color: var(--warning-100);
    }

    .timeline-marker.cancelled .marker-dot {
      background: var(--gray-400);
      border-color: var(--gray-100);
    }

    .timeline-content {
      flex: 1;
      min-width: 0;
    }

    .appointment-card {
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      padding: var(--space-3) var(--space-4);
    }

    :host-context(.dark) .appointment-card {
      background: var(--gray-800);
    }

    .appointment-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
    }

    .appointment-service {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0;
    }

    .appointment-customer {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-top: var(--space-2);
    }

    .appointment-customer span {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .appointment-notes {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      margin: var(--space-2) 0 0;
      font-style: italic;
    }

    .empty-schedule {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-8);
      color: var(--text-secondary);
      text-align: center;
    }

    .empty-schedule .material-icons-outlined {
      font-size: 2.5rem;
      color: var(--gray-300);
      margin-bottom: var(--space-2);
    }

    .empty-schedule p {
      font-size: var(--font-size-sm);
      margin: 0;
    }

    .view-all-link {
      font-size: var(--font-size-sm);
      color: var(--primary-500);
      text-decoration: none;
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

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .review-item {
      padding: var(--space-3);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
    }

    :host-context(.dark) .review-item {
      background: var(--gray-800);
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-2);
    }

    .review-meta {
      flex: 1;
    }

    .customer-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0;
    }

    .review-rating {
      display: flex;
      gap: 0.125rem;
      margin-top: 2px;
    }

    .star {
      font-size: 0.875rem;
      color: var(--gray-300);
    }

    .star.filled {
      color: var(--warning-500);
    }

    .review-comment {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      line-height: var(--line-height-relaxed);
    }

    .week-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
    }

    .week-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      margin-bottom: var(--space-2);
    }

    .stat-icon.completed {
      background: var(--success-100);
      color: var(--success-600);
    }

    :host-context(.dark) .stat-icon.completed {
      background: rgba(34, 197, 94, 0.2);
    }

    .stat-icon.upcoming {
      background: var(--primary-100);
      color: var(--primary-600);
    }

    :host-context(.dark) .stat-icon.upcoming {
      background: rgba(79, 70, 229, 0.2);
    }

    .stat-icon.cancelled {
      background: var(--gray-100);
      color: var(--gray-500);
    }

    :host-context(.dark) .stat-icon.cancelled {
      background: var(--gray-800);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }
  `],
})
export class ProviderDashboardComponent {
  authService = inject(AuthService);

  userFirstName = () => this.authService.user()?.first_name ?? 'Provider';

  todayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  stats = signal({
    todayAppointments: 5,
    monthlyRevenue: 3250,
    rating: 4.9,
    totalCustomers: 48,
  });

  weekStats = signal({
    completed: 18,
    upcoming: 7,
    cancelled: 2,
  });

  todayAppointments = signal([
    {
      id: '1',
      service_name: 'Haircut & Styling',
      customer_name: 'Emma Wilson',
      customer_avatar: null,
      start_time: '2026-07-01T09:00:00',
      end_time: '2026-07-01T10:00:00',
      status: 'completed',
      notes: 'First-time customer',
    },
    {
      id: '2',
      service_name: 'Hair Coloring',
      customer_name: 'James Brown',
      customer_avatar: null,
      start_time: '2026-07-01T10:30:00',
      end_time: '2026-07-01T12:00:00',
      status: 'in_progress',
    },
    {
      id: '3',
      service_name: 'Beard Trim',
      customer_name: 'Marcus Lee',
      customer_avatar: null,
      start_time: '2026-07-01T14:00:00',
      end_time: '2026-07-01T14:30:00',
      status: 'confirmed',
    },
  ]);

  recentReviews = signal([
    {
      id: '1',
      customer_name: 'Emma Wilson',
      customer_avatar: null,
      rating: 5,
      comment: 'Amazing service! Will definitely come back.',
    },
    {
      id: '2',
      customer_name: 'David Chen',
      customer_avatar: null,
      rating: 4,
      comment: 'Great haircut, very professional.',
    },
  ]);

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  getStatusVariant(status: string): 'success' | 'warning' | 'gray' {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'in_progress':
      case 'pending':
        return 'warning';
      default:
        return 'gray';
    }
  }
}
