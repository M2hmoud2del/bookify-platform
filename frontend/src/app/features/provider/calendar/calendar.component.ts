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
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
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
