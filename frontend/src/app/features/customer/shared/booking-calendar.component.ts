import { Component, input, output, signal, computed, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay } from '../shared/customer.models';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-calendar.component.html',
  styleUrl: './booking-calendar.component.css',
})
export class BookingCalendarComponent implements OnChanges {
  selectedDate = input<Date | null>(null);
  minDate = input<Date | null>(null);
  availableDates = input<string[]>([]);

  dateChange = output<Date>();

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  viewDate = signal(new Date());

  ngOnChanges(): void {
    if (this.selectedDate()) {
      this.viewDate.set(new Date(this.selectedDate()!));
    }
  }

  monthYearLabel(): string {
    return this.viewDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  canGoPrev(): boolean {
    const now = new Date();
    const current = this.viewDate();
    return current.getFullYear() > now.getFullYear() ||
      (current.getFullYear() === now.getFullYear() && current.getMonth() > now.getMonth());
  }

  prevMonth(): void {
    if (!this.canGoPrev()) return;
    const d = new Date(this.viewDate());
    d.setMonth(d.getMonth() - 1);
    this.viewDate.set(d);
  }

  nextMonth(): void {
    const d = new Date(this.viewDate());
    d.setMonth(d.getMonth() + 1);
    this.viewDate.set(d);
  }

  calendarDays = computed<CalendarDay[]>(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minD = this.minDate() ?? today;

    const days: CalendarDay[] = [];

    // Previous month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push(this.createDay(d, false, today, minD));
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push(this.createDay(d, true, today, minD));
    }

    // Next month padding to fill 6 rows (42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push(this.createDay(d, false, today, minD));
    }

    return days;
  });

  private createDay(d: Date, isCurrentMonth: boolean, today: Date, minDate: Date): CalendarDay {
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: d.getDate(),
      dateObj: new Date(d),
      isCurrentMonth,
      isToday: d.getTime() === today.getTime(),
      isPast: d < minDate,
      isSelectable: isCurrentMonth && d >= minDate,
      hasAvailability: this.availableDates().includes(dateStr),
    };
  }

  isSelected(day: CalendarDay): boolean {
    const sel = this.selectedDate();
    if (!sel) return false;
    return day.dateObj.toDateString() === sel.toDateString();
  }

  onSelectDay(day: CalendarDay): void {
    if (!day.isSelectable) return;
    this.dateChange.emit(day.dateObj);
  }
}
