import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AppointmentTableComponent } from '../shared/appointment-table.component';
import { MOCK_PROVIDER_APPOINTMENTS, PopulatedAppointment } from '../shared/provider.models';

type Tab = 'all' | 'today' | 'upcoming' | 'completed' | 'cancelled';

@Component({
  selector: 'app-provider-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, EmptyStateComponent, AppointmentTableComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class ProviderAppointmentsComponent {
  activeTab = signal<Tab>('all');

  allAppointments = signal<PopulatedAppointment[]>(MOCK_PROVIDER_APPOINTMENTS);

  todayAppointments = computed(() =>
    this.allAppointments().filter(a => a.localDate === '2026-07-12')
  );

  upcomingAppointments = computed(() =>
    this.allAppointments().filter(a => ['pending_payment', 'confirmed'].includes(a.status))
  );

  completedAppointments = computed(() =>
    this.allAppointments().filter(a => a.status === 'completed')
  );

  cancelledAppointments = computed(() =>
    this.allAppointments().filter(a => a.status === 'cancelled')
  );

  filteredAppointments = computed(() => {
    const tab = this.activeTab();
    if (tab === 'all')       return this.allAppointments();
    if (tab === 'today')     return this.todayAppointments();
    if (tab === 'upcoming')  return this.upcomingAppointments();
    if (tab === 'completed') return this.completedAppointments();
    if (tab === 'cancelled') return this.cancelledAppointments();
    return [];
  });

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

  onConfirm(id: string): void {
    this.allAppointments.update(list =>
      list.map(a => a._id === id ? { ...a, status: 'confirmed' as const } : a)
    );
  }

  onCancel(id: string): void {
    this.allAppointments.update(list =>
      list.map(a => a._id === id ? { ...a, status: 'cancelled' as const, paymentStatus: 'refunded' as const } : a)
    );
  }
}
