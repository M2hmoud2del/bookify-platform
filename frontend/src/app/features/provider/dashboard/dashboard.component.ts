import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppointmentView } from '../../../core/models/appointment.model';
import { ReviewView } from '../../../core/models/review.model';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ReviewsApi } from '../../customer/reviews/reviews.api';
import { DashboardApi } from './dashboard.api';

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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class ProviderDashboardComponent {
  authService = inject(AuthService);
  private dashboardApi = inject(DashboardApi);
  private reviewsApi = inject(ReviewsApi);

  loading = signal(false);
  error = signal<string | null>(null);

  userFirstName = () => this.authService.user()?.name ?? 'Provider';

  todayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  stats = signal({
    todayAppointments: 0,
    monthlyRevenue: 0,
    rating: 0,
    totalCustomers: 0,
  });

  weekStats = signal({
    completed: 0,
    upcoming: 0,
    cancelled: 0,
  });

  todayAppointments = signal<AppointmentView[]>([]);

  recentReviews = signal<ReviewView[]>([]);

  constructor() {
    void this.loadDashboard();
  }

  async loadDashboard(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const dashboard = await this.dashboardApi.getProviderDashboard();
      this.stats.set({
        todayAppointments: dashboard.todayAppointments,
        monthlyRevenue: dashboard.monthlyRevenue,
        rating: dashboard.averageRating,
        totalCustomers: dashboard.totalCustomers,
      });
      this.weekStats.set({
        completed: dashboard.completedAppointments,
        upcoming: dashboard.upcomingAppointments,
        cancelled: dashboard.cancelledAppointments,
      });
      this.todayAppointments.set(dashboard.todayAppointmentList);
      this.recentReviews.set(dashboard.recentReviews.slice(0, 2));
      await this.loadRecentReviewsFallback();
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load dashboard.'));
      this.todayAppointments.set([]);
      this.recentReviews.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  }

  getStatusVariant(status: string): 'success' | 'warning' | 'gray' | 'primary' {
    switch (status) {
      case 'confirmed':
        return 'primary';
      case 'completed':
        return 'success';
      case 'pending_payment':
        return 'warning';
      default:
        return 'gray';
    }
  }

  private async loadRecentReviewsFallback(): Promise<void> {
    if (this.recentReviews().length > 0) {
      return;
    }

    const providerId = this.authService.user()?._id;
    if (!providerId) {
      return;
    }

    try {
      const result = await this.reviewsApi.getProviderReviews(providerId);
      this.recentReviews.set(result.reviews.slice(0, 2));
    } catch {
      this.recentReviews.set([]);
    }
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
