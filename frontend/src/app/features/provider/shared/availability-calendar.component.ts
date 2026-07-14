import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AvailDay {
  date: number;
  dateObj: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  appointments: number;
  available: boolean;
}

@Component({
  selector: 'app-availability-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-calendar.component.html',
  styleUrl: './availability-calendar.component.css',
})
export class AvailabilityCalendarComponent {
  blockedDates = input<string[]>([]);
  appointmentCounts = input<Record<string, number>>({});
  dateSelect = output<Date>();

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  viewDate = signal(new Date());
  selectedDate = signal<Date | null>(null);

  monthLabel = computed(() =>
    this.viewDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );

  selectedDateLabel = computed(() => {
    const d = this.selectedDate();
    return d ? d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  });

  calendarDays = computed<AvailDay[]>(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: AvailDay[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push(this.createDay(d, false, today));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push(this.createDay(d, true, today));
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push(this.createDay(d, false, today));
    }

    return days;
  });

  private createDay(d: Date, isCurrentMonth: boolean, today: Date): AvailDay {
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: d.getDate(),
      dateObj: new Date(d),
      isCurrentMonth,
      isToday: d.getTime() === today.getTime(),
      isPast: d < today,
      appointments: this.appointmentCounts()[dateStr] ?? 0,
      available: !this.blockedDates().includes(dateStr),
    };
  }

  prevMonth(): void {
    const d = new Date(this.viewDate());
    d.setMonth(d.getMonth() - 1);
    this.viewDate.set(d);
  }

  nextMonth(): void {
    const d = new Date(this.viewDate());
    d.setMonth(d.getMonth() + 1);
    this.viewDate.set(d);
  }

  onSelect(day: AvailDay): void {
    if (!day.isCurrentMonth || day.isPast) return;
    this.selectedDate.set(day.dateObj);
    this.dateSelect.emit(day.dateObj);
  }
}
