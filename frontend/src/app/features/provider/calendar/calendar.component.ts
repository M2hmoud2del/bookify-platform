import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { AppointmentsApi } from '../../customer/appointments/appointments.api';
import { AppointmentView } from '../../../core/models/appointment.model';

const FINAL_STATUSES = ['completed', 'cancelled', 'rejected'];

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ModalComponent, AvatarComponent, BadgeComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  private appointmentsApi = inject(AppointmentsApi);

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  currentDate = signal(new Date());
  viewMode = signal<'month' | 'week' | 'day'>('month');
  selectedDate = signal(new Date());
  selectedAppointment = signal<AppointmentView | null>(null);

  loading = signal(false);
  appointments = signal<AppointmentView[]>([]);
  actionLoading = signal(false);
  actionError = signal<string | null>(null);

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

  // When the selected date changes (in day view), recompute the day's appointments
  selectedDayAppointments = computed(() => {
    const selected = this.selectedDate();
    const localDate = this.toDateString(selected);
    return this.appointments().filter(a => a.localDate === localDate);
  });

  constructor() {
    void this.loadAppointments();

    // Reload when the viewed month changes
    effect(() => {
      void this.currentMonth(); // track dependency
      void this.loadAppointments();
    });
  }

  async loadAppointments(): Promise<void> {
    this.loading.set(true);
    try {
      const apts = await this.appointmentsApi.getProviderAppointments();
      this.appointments.set(apts);
    } catch {
      this.appointments.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  toDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getAppointmentsForDate(date: Date): AppointmentView[] {
    const localDate = this.toDateString(date);
    return this.appointments().filter(a => a.localDate === localDate);
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':      return 'var(--primary-500)';
      case 'completed':      return 'var(--success-500)';
      case 'pending_payment':return 'var(--warning-500)';
      case 'cancelled':      return 'var(--gray-400)';
      case 'rejected':       return 'var(--gray-400)';
      default:               return 'var(--primary-500)';
    }
  }

  getStatusVariant(status: string | undefined): 'success' | 'warning' | 'gray' | 'primary' | 'danger' {
    switch (status) {
      case 'confirmed':       return 'primary';
      case 'completed':       return 'success';
      case 'pending_payment': return 'warning';
      case 'cancelled':
      case 'rejected':        return 'danger';
      default:                return 'gray';
    }
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.viewMode.set('day');
  }

  openAppointmentDetail(apt: AppointmentView): void {
    this.selectedAppointment.set(apt);
  }

  openNewAppointment(hour: string): void {
    console.log('New appointment at:', hour);
  }

  getAppointmentTop(apt: AppointmentView): string {
    const [h, m] = apt.startTime.split(':').map(Number);
    const totalMinutes = (h - 8) * 60 + m;
    return `${totalMinutes}px`;
  }

  getAppointmentHeight(apt: AppointmentView): string {
    const [sh, sm] = apt.startTime.split(':').map(Number);
    const [eh, em] = apt.endTime.split(':').map(Number);
    const duration = (eh - sh) * 60 + (em - sm);
    return `${Math.max(duration, 30)}px`;
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

  canActOnAppointment(status: string | undefined): boolean {
    return !!status && !FINAL_STATUSES.includes(status);
  }

  async completeSelectedAppointment(): Promise<void> {
    const apt = this.selectedAppointment();
    if (!apt) return;
    this.actionLoading.set(true);
    this.actionError.set(null);
    try {
      const updated = await this.appointmentsApi.completeAppointment(apt._id);
      this.appointments.update(list => list.map(a => a._id === updated._id ? updated : a));
      this.selectedAppointment.set(updated);
    } catch (err) {
      this.actionError.set((err as { message?: string })?.message ?? 'Failed to complete appointment.');
    } finally {
      this.actionLoading.set(false);
    }
  }

  async cancelSelectedAppointment(): Promise<void> {
    const apt = this.selectedAppointment();
    if (!apt) return;
    this.actionLoading.set(true);
    this.actionError.set(null);
    try {
      const updated = await this.appointmentsApi.cancelAppointment(apt._id);
      this.appointments.update(list => list.map(a => a._id === updated._id ? updated : a));
      this.selectedAppointment.set(updated);
    } catch (err) {
      this.actionError.set((err as { message?: string })?.message ?? 'Failed to cancel appointment.');
    } finally {
      this.actionLoading.set(false);
    }
  }
}
