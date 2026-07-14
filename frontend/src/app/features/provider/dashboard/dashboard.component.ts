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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
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
