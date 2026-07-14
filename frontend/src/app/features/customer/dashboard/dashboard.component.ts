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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
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
