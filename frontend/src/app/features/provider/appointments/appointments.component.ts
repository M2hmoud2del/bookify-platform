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
  template: `
    <div class="appointments-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Appointments</h1>
          <p class="page-subtitle">Manage all your customer appointments</p>
        </div>
        <app-button variant="primary" routerLink="/provider/calendar">
          <span class="material-icons-outlined">calendar_today</span>
          View Calendar
        </app-button>
      </div>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button
          type="button"
          class="tab-btn"
          [class.is-active]="activeTab() === 'all'"
          (click)="activeTab.set('all')"
        >
          All <span class="tab-count">{{ allAppointments().length }}</span>
        </button>
        <button
          type="button"
          class="tab-btn"
          [class.is-active]="activeTab() === 'today'"
          (click)="activeTab.set('today')"
        >
          Today <span class="tab-count">{{ todayAppointments().length }}</span>
        </button>
        <button
          type="button"
          class="tab-btn"
          [class.is-active]="activeTab() === 'upcoming'"
          (click)="activeTab.set('upcoming')"
        >
          Upcoming <span class="tab-count">{{ upcomingAppointments().length }}</span>
        </button>
        <button
          type="button"
          class="tab-btn"
          [class.is-active]="activeTab() === 'completed'"
          (click)="activeTab.set('completed')"
        >
          Completed <span class="tab-count">{{ completedAppointments().length }}</span>
        </button>
        <button
          type="button"
          class="tab-btn"
          [class.is-active]="activeTab() === 'cancelled'"
          (click)="activeTab.set('cancelled')"
        >
          Cancelled <span class="tab-count">{{ cancelledAppointments().length }}</span>
        </button>
      </div>

      <!-- Table -->
      @if (filteredAppointments().length > 0) {
        <app-appointment-table
          [appointments]="filteredAppointments()"
          (confirm)="onConfirm($event)"
          (cancel)="onCancel($event)"
        />
      } @else {
        <app-empty-state
          icon="event_busy"
          title="No appointments"
          [description]="emptyDescription()"
          actionLabel="View Calendar"
          [routerLink]="['/provider/calendar']"
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
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tabs-bar::-webkit-scrollbar { display: none; }

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
      white-space: nowrap;
      transition: all var(--transition-fast);
    }

    .tab-btn:hover { color: var(--primary-500); }
    .tab-btn.is-active { color: var(--primary-600); border-bottom-color: var(--primary-500); }
    :host-context(.dark) .tab-btn.is-active { color: var(--primary-400); }

    .tab-count {
      padding: 0 var(--space-1);
      font-size: var(--font-size-xs);
      background: var(--gray-100);
      border-radius: var(--radius-full);
      min-width: 20px;
      text-align: center;
    }

    :host-context(.dark) .tab-count { background: var(--gray-700); color: var(--gray-300); }
  `],
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
