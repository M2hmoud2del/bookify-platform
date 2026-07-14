import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AppointmentCardComponent } from '../shared/appointment-card.component';
import { AppointmentView } from '../../../core/models/appointment.model';
import { AppointmentsApi } from './appointments.api';

type Tab = 'upcoming' | 'past' | 'cancelled';

@Component({
  selector: 'app-customer-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, EmptyStateComponent, AppointmentCardComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class CustomerAppointmentsComponent {
  private appointmentsApi = inject(AppointmentsApi);

  activeTab = signal<Tab>('upcoming');
  appointments = signal<AppointmentView[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  upcomingAppointments = computed(() =>
    this.appointments().filter(a => ['pending_payment', 'confirmed'].includes(a.status))
  );

  pastAppointments = computed(() =>
    this.appointments().filter(a => a.status === 'completed')
  );

  cancelledAppointments = computed(() =>
    this.appointments().filter(a => a.status === 'cancelled' || a.status === 'rejected')
  );

  filteredAppointments = computed<AppointmentView[]>(() => {
    const tab = this.activeTab();
    if (tab === 'upcoming') return this.upcomingAppointments();
    if (tab === 'past') return this.pastAppointments();
    if (tab === 'cancelled') return this.cancelledAppointments();
    return [];
  });

  constructor() {
    void this.loadAppointments();
  }

  async loadAppointments(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.appointments.set(await this.appointmentsApi.getMyAppointments());
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load appointments.'));
    } finally {
      this.loading.set(false);
    }
  }

  emptyIcon(): string {
    return this.activeTab() === 'upcoming' ? 'event_available' : 'event_busy';
  }

  emptyTitle(): string {
    const tab = this.activeTab();
    if (tab === 'upcoming') return 'No upcoming appointments';
    if (tab === 'past') return 'No past appointments';
    if (tab === 'cancelled') return 'No cancelled appointments';
    return 'No appointments';
  }

  emptyDescription(): string {
    const tab = this.activeTab();
    if (tab === 'upcoming') return 'Book your first appointment to get started.';
    if (tab === 'past') return 'Your completed appointments will appear here.';
    if (tab === 'cancelled') return 'Cancelled appointments will appear here.';
    return '';
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
