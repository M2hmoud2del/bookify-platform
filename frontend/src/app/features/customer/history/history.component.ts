import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AppointmentsApi } from '../appointments/appointments.api';
import { AppointmentView } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-customer-history',
  standalone: true,
  imports: [CommonModule, CardComponent, EmptyStateComponent, DatePipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent {
  private appointmentsApi = inject(AppointmentsApi);

  loading = signal(true);
  error = signal<string | null>(null);
  appointments = signal<AppointmentView[]>([]);

  historyAppointments = computed(() =>
    this.appointments()
      .filter(a => ['completed', 'cancelled', 'rejected'].includes(a.status))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );

  constructor() {
    this.loadHistory();
  }

  async loadHistory(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.appointments.set(await this.appointmentsApi.getMyAppointments());
    } catch (err: unknown) {
      this.error.set((err as Error).message || 'Failed to load history');
    } finally {
      this.loading.set(false);
    }
  }
}
