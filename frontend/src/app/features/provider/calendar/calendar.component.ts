import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent, ButtonComponent, AvatarComponent, BadgeComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'];

  currentDate = signal(new Date());
  viewMode = signal<'month' | 'week' | 'day'>('month');
  selectedDate = signal(new Date());
  selectedAppointment = signal<any>(null);

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

  selectedDayAppointments = signal([
    {
      id: '1',
      service_name: 'Haircut & Styling',
      customer_name: 'Emma Wilson',
      start_time: '2026-07-01T09:00:00',
      end_time: '2026-07-01T10:00:00',
      status: 'confirmed',
      duration: 60,
      total_amount: 65,
    },
    {
      id: '2',
      service_name: 'Hair Coloring',
      customer_name: 'James Brown',
      start_time: '2026-07-01T10:30:00',
      end_time: '2026-07-01T12:00:00',
      status: 'in_progress',
      duration: 90,
      total_amount: 120,
    },
  ]);

  appointments = signal([
    { id: '1', service_name: 'Haircut', start_time: '2026-07-01T09:00:00', end_time: '2026-07-01T10:00:00', status: 'confirmed', customer_name: 'Emma Wilson' },
    { id: '2', service_name: 'Hair Coloring', start_time: '2026-07-01T10:30:00', end_time: '2026-07-01T12:00:00', status: 'pending', customer_name: 'James Brown' },
    { id: '3', service_name: 'Facial', start_time: '2026-07-02T14:00:00', end_time: '2026-07-02T15:00:00', status: 'confirmed', customer_name: 'Sarah Davis' },
    { id: '4', service_name: 'Massage', start_time: '2026-07-03T16:00:00', end_time: '2026-07-03T17:30:00', status: 'cancelled', customer_name: 'Mike Johnson' },
  ]);

  getAppointmentsForDate(date: Date): any[] {
    return this.appointments().filter(apt => {
      const aptDate = new Date(apt.start_time);
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
      case 'in_progress': return 'var(--warning-500)';
      case 'cancelled': return 'var(--gray-400)';
      default: return 'var(--primary-500)';
    }
  }

  getStatusVariant(status: string): 'success' | 'warning' | 'gray' {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'success';
      case 'in_progress':
      case 'pending':
        return 'warning';
      default:
        return 'gray';
    }
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.viewMode.set('day');
  }

  openAppointmentDetail(apt: any): void {
    this.selectedAppointment.set(apt);
  }

  openNewAppointment(hour: string): void {
    console.log('New appointment at:', hour);
  }

  getAppointmentTop(apt: any): string {
    const start = new Date(apt.start_time);
    const hours = start.getHours();
    const minutes = start.getMinutes();
    const totalMinutes = (hours - 8) * 60 + minutes;
    return `${totalMinutes}px`;
  }

  getAppointmentHeight(apt: any): string {
    return `${apt.duration}px`;
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
