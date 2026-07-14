import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AppointmentCardComponent } from '../shared/appointment-card.component';
import { MOCK_APPOINTMENTS, PopulatedAppointment } from '../shared/customer.models';

type Tab = 'upcoming' | 'past' | 'cancelled';

@Component({
  selector: 'app-customer-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, EmptyStateComponent, AppointmentCardComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class CustomerAppointmentsComponent {
  activeTab = signal<Tab>('upcoming');

  upcomingAppointments = computed(() =>
    MOCK_APPOINTMENTS.filter(a => ['pending_payment', 'confirmed'].includes(a.status))
  );

  pastAppointments = computed(() =>
    MOCK_APPOINTMENTS.filter(a => a.status === 'completed')
  );

  cancelledAppointments = computed(() =>
    MOCK_APPOINTMENTS.filter(a => a.status === 'cancelled')
  );

  filteredAppointments = computed<PopulatedAppointment[]>(() => {
    const tab = this.activeTab();
    if (tab === 'upcoming')   return this.upcomingAppointments();
    if (tab === 'past')       return this.pastAppointments();
    if (tab === 'cancelled')  return this.cancelledAppointments();
    return [];
  });

  emptyIcon(): string {
    return this.activeTab() === 'upcoming' ? 'event_available' : 'event_busy';
  }

  emptyTitle(): string {
    const tab = this.activeTab();
    if (tab === 'upcoming')   return 'No upcoming appointments';
    if (tab === 'past')       return 'No past appointments';
    if (tab === 'cancelled')  return 'No cancelled appointments';
    return 'No appointments';
  }

  emptyDescription(): string {
    const tab = this.activeTab();
    if (tab === 'upcoming')   return 'Book your first appointment to get started.';
    if (tab === 'past')       return 'Your completed appointments will appear here.';
    if (tab === 'cancelled')  return 'Cancelled appointments will appear here.';
    return '';
  }
}
