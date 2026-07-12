import { Component, input, output, signal, computed, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay } from '../shared/customer.models';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar">
      <div class="calendar-header">
        <button type="button" class="nav-btn" (click)="prevMonth()" [disabled]="!canGoPrev()">
          <span class="material-icons-outlined">chevron_left</span>
        </button>
        <h3 class="calendar-title">{{ monthYearLabel() }}</h3>
        <button type="button" class="nav-btn" (click)="nextMonth()">
          <span class="material-icons-outlined">chevron_right</span>
        </button>
      </div>

      <div class="calendar-weekdays">
        @for (day of weekdays; track day) {
          <span class="weekday">{{ day }}</span>
        }
      </div>

      <div class="calendar-grid">
        @for (day of calendarDays(); track day.dateObj.getTime()) {
          <button
            type="button"
            class="calendar-day"
            [class.is-other-month]="!day.isCurrentMonth"
            [class.is-today]="day.isToday"
            [class.is-selected]="isSelected(day)"
            [class.is-disabled]="!day.isSelectable"
            [disabled]="!day.isSelectable || !day.isCurrentMonth"
            (click)="onSelectDay(day)"
          >
            <span class="day-number">{{ day.date }}</span>
            @if (day.hasAvailability && day.isSelectable) {
              <span class="availability-dot"></span>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .calendar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
    }

    :host-context(.dark) .calendar {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-4);
    }

    .calendar-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover:not(:disabled) {
        background: var(--primary-50);
        color: var(--primary-600);
        border-color: var(--primary-300);
      }

      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }

    :host-context(.dark) .nav-btn {
      background: var(--gray-700);
      border-color: var(--gray-600);

      &:hover:not(:disabled) {
        background: rgba(79, 70, 229, 0.15);
        color: var(--primary-400);
      }
    }

    .nav-btn .material-icons-outlined { font-size: 1.25rem; }

    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-1);
      margin-bottom: var(--space-2);
    }

    .weekday {
      text-align: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: var(--space-2) 0;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-1);
    }

    .calendar-day {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      background: transparent;
      border: 2px solid transparent;
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover:not(:disabled) {
        background: var(--primary-50);
        border-color: var(--primary-200);
      }

      &.is-other-month {
        opacity: 0.3;
        cursor: default;
      }

      &.is-today {
        border-color: var(--primary-300);
      }

      &.is-selected {
        background: var(--primary-500);
        color: #fff;
        border-color: var(--primary-500);

        .availability-dot { background: rgba(255, 255, 255, 0.8); }
      }

      &.is-disabled {
        color: var(--gray-300);
        cursor: not-allowed;

        &:hover { background: transparent; border-color: transparent; }
      }
    }

    :host-context(.dark) .calendar-day {
      color: var(--gray-100);

      &:hover:not(:disabled) {
        background: rgba(79, 70, 229, 0.1);
        border-color: var(--primary-500);
      }

      &.is-disabled { color: var(--gray-600); }
    }

    .day-number {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .availability-dot {
      width: 4px;
      height: 4px;
      border-radius: var(--radius-full);
      background: var(--success-500);
      margin-top: 2px;
    }
  `],
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
