import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AppointmentTableComponent } from '../shared/appointment-table.component';
import { AppointmentView } from '../../../core/models/appointment.model';
import { AppointmentsApi } from '../../customer/appointments/appointments.api';

type Tab = 'all' | 'today' | 'upcoming' | 'completed' | 'cancelled';

@Component({
  selector: 'app-provider-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, EmptyStateComponent, AppointmentTableComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class ProviderAppointmentsComponent {
  private appointmentsApi = inject(AppointmentsApi);

  activeTab = signal<Tab>('all');
  allAppointments = signal<AppointmentView[]>([]);
  loading = signal(false);
  actionId = signal<string | null>(null);
  error = signal<string | null>(null);

  todayAppointments = computed(() =>
    this.allAppointments().filter(a => a.localDate === this.todayString())
  );

  upcomingAppointments = computed(() =>
    this.allAppointments().filter(a => ['pending_payment', 'confirmed'].includes(a.status))
  );

  completedAppointments = computed(() =>
    this.allAppointments().filter(a => a.status === 'completed')
  );

  cancelledAppointments = computed(() =>
    this.allAppointments().filter(a => a.status === 'cancelled' || a.status === 'rejected')
  );

  filteredAppointments = computed(() => {
    const tab = this.activeTab();
    if (tab === 'all') return this.allAppointments();
    if (tab === 'today') return this.todayAppointments();
    if (tab === 'upcoming') return this.upcomingAppointments();
    if (tab === 'completed') return this.completedAppointments();
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
      this.allAppointments.set(await this.appointmentsApi.getProviderAppointments());
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load provider appointments.'));
    } finally {
      this.loading.set(false);
    }
  }

  emptyDescription(): string {
    const tab = this.activeTab();
    const labels: Record<string, string> = {
      all: 'You have no appointments yet.',
      today: 'No appointments scheduled for today.',
      upcoming: 'No upcoming appointments.',
      completed: 'No completed appointments yet.',
      cancelled: 'No cancelled appointments.',
    };
    return labels[tab] ?? 'No appointments found.';
  }

  async onConfirm(id: string): Promise<void> {
    await this.runAppointmentAction(id, () => this.appointmentsApi.acceptAppointment(id));
  }

  async onCancel(id: string): Promise<void> {
    const appointment = this.allAppointments().find(item => item._id === id);
    if (!appointment) return;

    if (appointment.status === 'pending_payment') {
      await this.runAppointmentAction(id, () => this.appointmentsApi.rejectAppointment(id));
      return;
    }

    await this.runAppointmentAction(id, () => this.appointmentsApi.cancelAppointment(id));
  }

  private async runAppointmentAction(id: string, action: () => Promise<AppointmentView>): Promise<void> {
    this.actionId.set(id);
    this.error.set(null);

    try {
      const updated = await action();
      this.allAppointments.update(list => list.map(appointment => appointment._id === id ? updated : appointment));
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to update appointment.'));
    } finally {
      this.actionId.set(null);
    }
  }

  private todayString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
