import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { WorkingHoursTableComponent } from '../shared/working-hours-table.component';
import { AvailabilityCalendarComponent } from '../shared/availability-calendar.component';
import { WorkingHour } from '../../../core/models/user.model';
import { WorkingHoursApi } from './working-hours.api';

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
  private workingHoursApi = inject(WorkingHoursApi);

  workingDays = signal<WorkingHour[]>([]);
  blockedDates = signal<string[]>([]);
  appointmentCounts = signal<Record<string, number>>({});
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor() {
    void this.loadWorkingHours();
  }

  async loadWorkingHours(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.workingDays.set(await this.workingHoursApi.getMyWorkingHours());
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load working hours.'));
    } finally {
      this.loading.set(false);
    }
  }

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

  async save(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    try {
      this.workingDays.set(await this.workingHoursApi.updateMyWorkingHours(this.workingDays()));
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to save working hours.'));
    } finally {
      this.saving.set(false);
    }
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
