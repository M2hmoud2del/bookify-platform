import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { MOCK_PROVIDER_APPOINTMENTS, MOCK_PROVIDER_REVIEWS, PopulatedAppointment, PopulatedReview } from '../shared/provider.models';

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

  userFirstName = () => this.authService.user()?.name ?? 'Provider';

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

  todayAppointments = signal<PopulatedAppointment[]>(MOCK_PROVIDER_APPOINTMENTS.filter(a => a.localDate === '2026-07-12'));

  recentReviews = signal<PopulatedReview[]>(MOCK_PROVIDER_REVIEWS.slice(0, 2));

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
}
