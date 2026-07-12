import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { MOCK_PROVIDER_APPOINTMENTS, PopulatedAppointment } from '../shared/provider.models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ModalComponent, AvatarComponent, BadgeComponent],
  template: `
    <div class="calendar-page">
      <div class="calendar-header">
        <div class="header-nav">
          <button type="button" class="nav-btn" (click)="prevMonth()">
            <span class="material-icons-outlined">chevron_left</span>
          </button>
          <h1 class="current-month">{{ currentMonth() | date:'MMMM y' }}</h1>
          <button type="button" class="nav-btn" (click)="nextMonth()">
            <span class="material-icons-outlined">chevron_right</span>
          </button>
        </div>
        <div class="view-toggle">
          <button type="button" class="toggle-btn" [ngClass]="{ 'is-active': viewMode() === 'month' }" (click)="viewMode.set('month')">
            Month
          </button>
          <button type="button" class="toggle-btn" [ngClass]="{ 'is-active': viewMode() === 'week' }" (click)="viewMode.set('week')">
            Week
          </button>
          <button type="button" class="toggle-btn" [ngClass]="{ 'is-active': viewMode() === 'day' }" (click)="viewMode.set('day')">
            Day
          </button>
        </div>
      </div>

      <div class="calendar-body">
        <!-- Month View -->
        @if (viewMode() === 'month') {
          <div class="calendar-grid">
            <div class="calendar-weekdays">
              @for (day of weekdays; track day) {
                <div class="weekday">{{ day }}</div>
              }
            </div>
            <div class="calendar-dates">
              @for (date of calendarDates(); track date.toISOString()) {
                <div
                  class="calendar-date"
                  [ngClass]="{
                    'is-today': isToday(date),
                    'is-outside': date.getMonth() !== currentMonth().getMonth()
                  }"
                  (click)="selectDate(date)"
                >
                  <span class="date-number">{{ date.getDate() }}</span>
                  @if (getAppointmentsForDate(date).length > 0) {
                    <div class="date-appointments">
                      @for (apt of getAppointmentsForDate(date).slice(0, 2); track apt._id) {
                        <div
                          class="appointment-indicator"
                          [style.background]="getStatusColor(apt.status)"
                          (click)="$event.stopPropagation(); openAppointmentDetail(apt)"
                        >
                          <span class="apt-time">{{ apt.startTime }}</span>
                          <span class="apt-title">{{ apt.service.title }}</span>
                        </div>
                      }
                      @if (getAppointmentsForDate(date).length > 2) {
                        <span class="more-appointments">+{{ getAppointmentsForDate(date).length - 2 }} more</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- Week View -->
        @if (viewMode() === 'week') {
          <div class="week-view">
            <div class="week-header">
              @for (day of weekDays(); track day.date) {
                <div class="day-header" [ngClass]="{ 'is-today': isToday(day.date) }">
                  <span class="day-name">{{ day.date | date:'EEE' }}</span>
                  <span class="day-number">{{ day.date.getDate() }}</span>
                </div>
              }
            </div>
            <div class="week-body">
              <div class="time-grid">
                @for (hour of hours; track hour) {
                  <div class="time-row">
                    <span class="time-label">{{ hour }}</span>
                    <div class="time-cells">
                      @for (day of weekDays(); track day.date) {
                        <div class="time-cell"></div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- Day View -->
        @if (viewMode() === 'day') {
          <div class="day-view">
            <div class="day-header">
              <button type="button" class="nav-btn" (click)="prevDay()">
                <span class="material-icons-outlined">chevron_left</span>
              </button>
              <div class="day-info">
                <span class="day-name">{{ selectedDate() | date:'EEEE' }}</span>
                <span class="day-date">{{ selectedDate() | date:'MMMM d, y' }}</span>
              </div>
              <button type="button" class="nav-btn" (click)="nextDay()">
                <span class="material-icons-outlined">chevron_right</span>
              </button>
            </div>
            <div class="day-body">
              <div class="time-grid">
                @for (hour of hours; track hour) {
                  <div class="time-row">
                    <span class="time-label">{{ hour }}</span>
                    <div class="time-slot" (click)="openNewAppointment(hour)"></div>
                  </div>
                }
              </div>
              @for (apt of selectedDayAppointments(); track apt._id) {
                <div
                  class="day-appointment"
                  [style.top]="getAppointmentTop(apt)"
                  [style.height]="getAppointmentHeight(apt)"
                  [style.background]="getStatusColor(apt.status)"
                  (click)="openAppointmentDetail(apt)"
                >
                  <span class="apt-time">{{ apt.startTime }} - {{ apt.endTime }}</span>
                  <span class="apt-title">{{ apt.service.title }}</span>
                  <span class="apt-customer">{{ apt.customer.name }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Appointment Detail Modal -->
      @if (selectedAppointment()) {
        <app-modal
          [isOpen]="!!selectedAppointment()"
          [title]="selectedAppointment()?.service?.title"
          [description]="'Appointment Details'"
          size="md"
          (close)="selectedAppointment.set(null)"
        >
          <div class="appointment-detail">
            <div class="detail-row">
              <span class="detail-label">Customer</span>
              <div class="detail-value">
                <app-avatar
                  [src]="selectedAppointment()?.customer?.avatar ?? undefined"
                  [name]="selectedAppointment()?.customer?.name ?? ''"
                  size="sm"
                />
                <span>{{ selectedAppointment()?.customer?.name }}</span>
              </div>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date & Time</span>
              <span class="detail-value">{{ selectedAppointment()?.localDate | date:'MMM d, y' }} {{ selectedAppointment()?.startTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration</span>
              <span class="detail-value">{{ selectedAppointment()?.service?.durationMinutes }} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status</span>
              <app-badge [variant]="getStatusVariant(selectedAppointment()?.status)">
                {{ selectedAppointment()?.status }}
              </app-badge>
            </div>
            <div class="detail-row">
              <span class="detail-label">Price</span>
              <span class="detail-value price">{{ selectedAppointment()?.service?.price | currency }}</span>
            </div>
          </div>
        </app-modal>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .calendar-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .calendar-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .calendar-header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: var(--text-secondary);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .nav-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    :host-context(.dark) .nav-btn:hover {
      background: var(--gray-800);
    }

    .current-month {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .view-toggle {
      display: flex;
      background: var(--gray-100);
      border-radius: var(--radius-lg);
      padding: 0.25rem;
    }

    :host-context(.dark) .view-toggle {
      background: var(--gray-800);
    }

    .toggle-btn {
      padding: var(--space-2) var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .toggle-btn.is-active {
      background: var(--surface);
      color: var(--text-primary);
      box-shadow: var(--shadow-sm);
    }

    :host-context(.dark) .toggle-btn.is-active {
      background: var(--gray-700);
    }

    .calendar-body {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    :host-context(.dark) .calendar-body {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .calendar-grid {
      display: flex;
      flex-direction: column;
    }

    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .calendar-weekdays {
      border-color: var(--gray-700);
    }

    .weekday {
      padding: var(--space-3);
      text-align: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .calendar-dates {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .calendar-date {
      min-height: 100px;
      padding: var(--space-2);
      border-right: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .calendar-date {
      border-color: var(--gray-700);
    }

    .calendar-date:nth-child(7n) {
      border-right: none;
    }

    .calendar-date:hover {
      background: var(--gray-50);
    }

    :host-context(.dark) .calendar-date:hover {
      background: var(--gray-900);
    }

    .calendar-date.is-today {
      background: var(--primary-50);
    }

    :host-context(.dark) .calendar-date.is-today {
      background: rgba(79, 70, 229, 0.1);
    }

    .calendar-date.is-outside {
      opacity: 0.4;
    }

    .date-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      border-radius: var(--radius-full);
    }

    .is-today .date-number {
      background: var(--primary-500);
      color: white;
    }

    .date-appointments {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: var(--space-1);
    }

    .appointment-indicator {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: 2px var(--space-2);
      font-size: var(--font-size-xs);
      color: white;
      border-radius: 2px;
      overflow: hidden;
      cursor: pointer;
    }

    .apt-time {
      flex-shrink: 0;
    }

    .apt-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .more-appointments {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      padding: 2px var(--space-2);
    }

    .appointment-detail {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .detail-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .detail-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .detail-value {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .detail-value.price {
      color: var(--primary-500);
      font-size: var(--font-size-lg);
    }

    /* Week View */
    .week-view {
      padding: var(--space-4);
    }

    .week-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-2);
      margin-bottom: var(--space-4);
    }

    .day-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-2);
      border-radius: var(--radius-lg);
    }

    .day-header.is-today {
      background: var(--primary-100);
    }

    :host-context(.dark) .day-header.is-today {
      background: rgba(79, 70, 229, 0.2);
    }

    .day-name {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .day-number {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    /* Day View */
    .day-view {
      padding: var(--space-4);
    }

    .day-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-4);
    }

    .day-info {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .day-view .day-name {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .day-date {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .day-body {
      position: relative;
    }

    .time-grid {
      display: flex;
      flex-direction: column;
    }

    .time-row {
      display: flex;
      boundary-bottom: 1px solid var(--border);
      min-height: 60px;
    }

    .time-label {
      width: 60px;
      padding: var(--space-2);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      text-align: right;
    }

    .time-slot {
      flex: 1;
      min-height: 60px;
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .time-slot:hover {
      background: var(--primary-50);
    }

    :host-context(.dark) .time-slot:hover {
      background: rgba(79, 70, 229, 0.1);
    }

    .day-appointment {
      position: absolute;
      left: 70px;
      right: var(--space-4);
      padding: var(--space-2);
      border-radius: var(--radius-md);
      color: white;
      overflow: hidden;
      cursor: pointer;
    }

    .day-appointment .apt-time {
      font-size: 10px;
      opacity: 0.9;
    }

    .day-appointment .apt-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .day-appointment .apt-customer {
      font-size: var(--font-size-xs);
      opacity: 0.9;
    }
  `],
})
export class CalendarComponent {
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'];

  currentDate = signal(new Date());
  viewMode = signal<'month' | 'week' | 'day'>('month');
  selectedDate = signal(new Date());
  selectedAppointment = signal<PopulatedAppointment | null>(null);

  currentMonth = computed(() => {
    const date = this.currentDate();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  calendarDates = computed(() => {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);
    const dates: Date[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      dates.push(new Date(year, m, -i));
    }
    dates.reverse();

    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, m, day));
    }

    const remaining = 42 - dates.length;
    for (let i = 1; i <= remaining; i++) {
      dates.push(new Date(year, m + 1, i));
    }

    return dates;
  });

  weekDays = computed(() => {
    const selected = this.selectedDate();
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - selected.getDay());

    const days: { date: Date }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push({ date });
    }
    return days;
  });

  selectedDayAppointments = signal<PopulatedAppointment[]>(MOCK_PROVIDER_APPOINTMENTS.filter(a => a.localDate === '2026-07-12'));

  appointments = signal<PopulatedAppointment[]>(MOCK_PROVIDER_APPOINTMENTS);

  getAppointmentsForDate(date: Date): PopulatedAppointment[] {
    return this.appointments().filter(apt => {
      const aptDate = new Date(apt.localDate + 'T00:00:00');
      return aptDate.toDateString() === date.toDateString();
    });
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'var(--primary-500)';
      case 'completed': return 'var(--success-500)';
      case 'pending_payment': return 'var(--warning-500)';
      case 'cancelled': return 'var(--gray-400)';
      default: return 'var(--primary-500)';
    }
  }

  getStatusVariant(status: string | undefined): 'success' | 'warning' | 'gray' | 'primary' {
    switch (status) {
      case 'confirmed':
        return 'primary';
      case 'completed':
        return 'success';
      case 'pending_payment':
        return 'warning';
      default:
        return 'gray';
    }
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.viewMode.set('day');
  }

  openAppointmentDetail(apt: PopulatedAppointment): void {
    this.selectedAppointment.set(apt);
  }

  openNewAppointment(hour: string): void {
    console.log('New appointment at:', hour);
  }

  getAppointmentTop(apt: PopulatedAppointment): string {
    const [h, m] = apt.startTime.split(':').map(Number);
    const totalMinutes = (h - 8) * 60 + m;
    return `${totalMinutes}px`;
  }

  getAppointmentHeight(apt: PopulatedAppointment): string {
    const [sh, sm] = apt.startTime.split(':').map(Number);
    const [eh, em] = apt.endTime.split(':').map(Number);
    const duration = (eh - sh) * 60 + (em - sm);
    return `${duration}px`;
  }

  prevMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  prevDay(): void {
    const selected = this.selectedDate();
    this.selectedDate.set(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() - 1));
  }

  nextDay(): void {
    const selected = this.selectedDate();
    this.selectedDate.set(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + 1));
  }
}
