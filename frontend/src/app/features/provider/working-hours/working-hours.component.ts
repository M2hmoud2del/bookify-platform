import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { WorkingHoursTableComponent } from '../shared/working-hours-table.component';
import { AvailabilityCalendarComponent } from '../shared/availability-calendar.component';
import { MOCK_WORKING_HOURS, WorkingHour } from '../shared/provider.models';

@Component({
  selector: 'app-working-hours',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    WorkingHoursTableComponent,
    AvailabilityCalendarComponent,
  ],
  templateUrl: './working-hours.component.html',
  styleUrl: './working-hours.component.css',
})
export class WorkingHoursComponent {
  workingDays = signal<WorkingHour[]>([...MOCK_WORKING_HOURS]);
  blockedDates = signal<string[]>(['2026-07-19', '2026-07-26']);
  appointmentCounts = signal<Record<string, number>>({
    '2026-07-12': 3,
    '2026-07-13': 1,
    '2026-07-14': 2,
    '2026-07-15': 1,
  });

  onDaysChange(days: WorkingHour[]): void {
    this.workingDays.set(days);
  }

  onDateSelect(date: Date): void {
    const dateStr = date.toISOString().split('T')[0];
    const blocked = this.blockedDates();
    if (blocked.includes(dateStr)) {
      this.blockedDates.set(blocked.filter(d => d !== dateStr));
    } else {
      this.blockedDates.set([...blocked, dateStr]);
    }
  }

  unblockDate(date: string): void {
    this.blockedDates.set(this.blockedDates().filter(d => d !== date));
  }

  blockRange(type: string): void {
    if (type === 'weekend') {
      const dates: string[] = [];
      for (let d = 13; d <= 31; d++) {
        const date = new Date(2026, 6, d);
        if (date.getDay() === 0 || date.getDay() === 6) {
          dates.push(date.toISOString().split('T')[0]);
        }
      }
      const existing = new Set(this.blockedDates());
      dates.forEach(d => existing.add(d));
      this.blockedDates.set(Array.from(existing));
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  save(): void {
    console.log('Saving working hours:', this.workingDays(), 'Blocked:', this.blockedDates());
  }
}
