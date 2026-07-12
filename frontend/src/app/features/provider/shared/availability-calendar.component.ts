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
  template: `
    <div class="avail-calendar">
      <div class="cal-header">
        <button type="button" class="nav-btn" (click)="prevMonth()">
          <span class="material-icons-outlined">chevron_left</span>
        </button>
        <h3 class="cal-title">{{ monthLabel() }}</h3>
        <button type="button" class="nav-btn" (click)="nextMonth()">
          <span class="material-icons-outlined">chevron_right</span>
        </button>
      </div>

      <div class="legend">
        <span class="legend-item"><span class="legend-dot has-apt"></span> Has Appointments</span>
        <span class="legend-item"><span class="legend-dot is-open"></span> Available</span>
        <span class="legend-item"><span class="legend-dot is-blocked"></span> Blocked</span>
      </div>

      <div class="weekdays">
        @for (d of weekdays; track d) { <span class="wd">{{ d }}</span> }
      </div>

      <div class="days-grid">
        @for (day of calendarDays(); track day.dateObj.getTime()) {
          <button
            type="button"
            class="day-cell"
            [class.other-month]="!day.isCurrentMonth"
            [class.is-today]="day.isToday"
            [class.is-past]="day.isPast"
            [class.has-appointments]="day.appointments > 0"
            [class.is-blocked]="!day.available && day.isCurrentMonth && !day.isPast"
            [disabled]="!day.isCurrentMonth || day.isPast"
            (click)="onSelect(day)"
          >
            <span class="day-num">{{ day.date }}</span>
            @if (day.appointments > 0 && day.isCurrentMonth) {
              <span class="apt-badge">{{ day.appointments }}</span>
            }
            @if (day.available && day.isCurrentMonth && !day.isPast && day.appointments === 0) {
              <span class="avail-dot"></span>
            }
          </button>
        }
      </div>

      @if (selectedDate()) {
        <div class="selected-info">
          <span class="material-icons-outlined">event</span>
          <span>{{ selectedDateLabel() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .avail-calendar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
    }

    :host-context(.dark) .avail-calendar {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .cal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-4);
    }

    .cal-title {
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
    }

    :host-context(.dark) .nav-btn { background: var(--gray-700); border-color: var(--gray-600); }
    .nav-btn:hover { background: var(--primary-50); color: var(--primary-600); border-color: var(--primary-300); }
    :host-context(.dark) .nav-btn:hover { background: rgba(79, 70, 229, 0.15); color: var(--primary-400); }

    .legend {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
    }

    .legend-dot.has-apt { background: var(--primary-500); }
    .legend-dot.is-open { background: var(--success-500); }
    .legend-dot.is-blocked { background: var(--gray-300); }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-1);
      margin-bottom: var(--space-2);
    }

    .wd {
      text-align: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      padding: var(--space-2) 0;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-1);
    }

    .day-cell {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      background: transparent;
      border: 2px solid transparent;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover:not(:disabled) { background: var(--primary-50); border-color: var(--primary-200); }
      &.other-month { opacity: 0.3; cursor: default; }
      &.is-today { border-color: var(--primary-300); }
      &.is-past { opacity: 0.4; cursor: not-allowed; }
      &.has-appointments { background: var(--primary-50); }
      &.is-blocked { background: var(--gray-50); }
    }

    :host-context(.dark) .day-cell {
      &.has-appointments { background: rgba(79, 70, 229, 0.1); }
      &.is-blocked { background: var(--gray-900); }
      &:hover:not(:disabled) { background: rgba(79, 70, 229, 0.15); border-color: var(--primary-500); }
    }

    .day-num {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .apt-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 0 4px;
      font-size: 9px;
      font-weight: var(--font-weight-bold);
      background: var(--primary-500);
      color: #fff;
      border-radius: var(--radius-full);
      min-width: 16px;
      text-align: center;
    }

    .avail-dot {
      width: 5px;
      height: 5px;
      border-radius: var(--radius-full);
      background: var(--success-500);
      margin-top: 2px;
    }

    .selected-info {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-top: var(--space-4);
      padding: var(--space-3) var(--space-4);
      background: var(--primary-50);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      color: var(--primary-700);
    }

    :host-context(.dark) .selected-info {
      background: rgba(79, 70, 229, 0.1);
      color: var(--primary-300);
    }
  `],
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
