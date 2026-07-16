import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppointmentsApi } from '../appointments/appointments.api';
import { AppointmentView } from '../../../core/models/appointment.model';
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
  private appointmentsApi = inject(AppointmentsApi);

  loading = signal(false);
  allAppointments = signal<AppointmentView[]>([]);

  userFirstName = () => {
    const user = this.authService.user();
    return user?.name?.split(' ')[0] ?? 'User';
  };

  // Stats derived from real data
  stats = computed(() => {
    const apts = this.allAppointments();
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = apts.filter(a =>
      (a.status === 'confirmed' || a.status === 'pending_payment') &&
      a.localDate >= today
    ).length;
    const completed = apts.filter(a => a.status === 'completed').length;
    const spent = apts
      .filter(a => a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + (a.totalAmount ?? a.service?.price ?? 0), 0);
    return { upcoming, completed, spent };
  });

  // Upcoming: confirmed/pending, future dates, sorted soonest first, max 5
  upcomingAppointments = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return this.allAppointments()
      .filter(a =>
        (a.status === 'confirmed' || a.status === 'pending_payment') &&
        a.localDate >= today
      )
      .sort((a, b) => a.localDate.localeCompare(b.localDate) || a.startTime.localeCompare(b.startTime))
      .slice(0, 5);
  });

  // Recent activity: past or completed/cancelled, sorted newest first, max 5
  recentActivity = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return this.allAppointments()
      .filter(a =>
        a.status === 'completed' || a.status === 'cancelled' || a.status === 'rejected' ||
        a.localDate < today
      )
      .sort((a, b) => b.localDate.localeCompare(a.localDate) || b.startTime.localeCompare(a.startTime))
      .slice(0, 5);
  });

  // Unique providers the customer has booked with
  frequentProviders = computed(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string; category: string; avatar?: string }[] = [];
    for (const apt of this.allAppointments()) {
      const pid = apt.provider._id;
      if (!seen.has(pid)) {
        seen.add(pid);
        result.push({
          id: pid,
          name: apt.provider.name,
          category: apt.service?.category ?? '',
          avatar: apt.provider.avatar,
        });
      }
      if (result.length >= 3) break;
    }
    return result;
  });

  constructor() {
    void this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      const apts = await this.appointmentsApi.getMyAppointments();
      this.allAppointments.set(apts);
    } catch {
      // silently fail — dashboard degrades gracefully to empty states
    } finally {
      this.loading.set(false);
    }
  }

  formatDate(dateStr: string): { day: string; month: string; time: string; short: string } {
    const date = new Date(dateStr + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: date.getDate().toString(),
      month: months[date.getMonth()],
      time: '',
      short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  }

  getStatusVariant(status: string): 'success' | 'warning' | 'gray' | 'danger' {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'pending_payment':
        return 'warning';
      case 'cancelled':
      case 'rejected':
        return 'danger';
      default:
        return 'gray';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      confirmed: 'Confirmed',
      completed: 'Completed',
      pending_payment: 'Pending',
      cancelled: 'Cancelled',
      rejected: 'Rejected',
    };
    return labels[status] ?? status;
  }

  getActivityIcon(status: string): string {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'cancelled': return 'cancel';
      case 'rejected': return 'block';
      default: return 'event';
    }
  }
}
