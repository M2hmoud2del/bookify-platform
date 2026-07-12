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
  template: `
    <div class="appointments-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Appointments</h1>
          <p class="page-subtitle">Manage your upcoming and past appointments</p>
        </div>
        <app-button variant="primary" routerLink="/customer/book">
          <span class="material-icons-outlined">add</span>
          Book New
        </app-button>
      </div>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button
          type="button"
          class="tab-btn"
          [class.is-active]="activeTab() === 'upcoming'"
          (click)="activeTab.set('upcoming')"
        >
          Upcoming
          <span class="tab-count">{{ upcomingAppointments().length }}</span>
        </button>
        <button
          type="button"
          class="tab-btn"
          [class.is-active]="activeTab() === 'past'"
          (click)="activeTab.set('past')"
        >
          Past
          <span class="tab-count">{{ pastAppointments().length }}</span>
        </button>
        <button
          type="button"
          class="tab-btn"
          [class.is-active]="activeTab() === 'cancelled'"
          (click)="activeTab.set('cancelled')"
        >
          Cancelled
          <span class="tab-count">{{ cancelledAppointments().length }}</span>
        </button>
      </div>

      <!-- Content -->
      @if (filteredAppointments().length > 0) {
        <div class="appointments-list">
          @for (appointment of filteredAppointments(); track appointment._id) {
            <app-appointment-card [appointment]="appointment" />
          }
        </div>
      } @else {
        <app-empty-state
          [icon]="emptyIcon()"
          [title]="emptyTitle()"
          [description]="emptyDescription()"
          actionLabel="Book an Appointment"
          [routerLink]="['/customer/book']"
        />
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .appointments-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .tabs-bar {
      display: flex;
      gap: var(--space-1);
      border-bottom: 2px solid var(--border);
    }

    :host-context(.dark) .tabs-bar { border-color: var(--gray-700); }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: none;
      border: none;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all var(--transition-fast);

      &:hover { color: var(--primary-500); }

      &.is-active {
        color: var(--primary-600);
        border-bottom-color: var(--primary-500);
      }
    }

    :host-context(.dark) .tab-btn.is-active { color: var(--primary-400); }

    .tab-count {
      padding: 0 var(--space-1);
      font-size: var(--font-size-xs);
      background: var(--gray-100);
      border-radius: var(--radius-full);
      min-width: 20px;
      text-align: center;
    }

    :host-context(.dark) .tab-count {
      background: var(--gray-700);
      color: var(--gray-300);
    }

    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
  `],
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
