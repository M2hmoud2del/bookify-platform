import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { WorkingHour } from '../../../core/models/user.model';

@Component({
  selector: 'app-working-hours-table',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent],
  templateUrl: './working-hours-table.component.html',
  styleUrl: './working-hours-table.component.css',
})
export class WorkingHoursTableComponent {
  days = input.required<WorkingHour[]>();
  daysChange = output<WorkingHour[]>();

  toggleDay(index: number): void {
    const arr = [...this.days()];
    const day = arr[index];
    arr[index] = {
      ...day,
      isClosed: !day.isClosed,
      startTime: day.isClosed ? day.startTime || '09:00' : undefined,
      endTime: day.isClosed ? day.endTime || '17:00' : undefined,
      breaks: day.isClosed ? day.breaks : [],
    };
    this.daysChange.emit(arr);
  }

  setDayTime(index: number, field: 'startTime' | 'endTime', value: string): void {
    const arr = [...this.days()];
    arr[index] = { ...arr[index], [field]: value };
    this.daysChange.emit(arr);
  }

  toggleBreak(index: number): void {
    const arr = [...this.days()];
    const day = arr[index];
    if (day.breaks.length > 0) {
      arr[index] = { ...day, breaks: [] };
    } else {
      arr[index] = { ...day, breaks: [{ startTime: '12:00', endTime: '13:00' }] };
    }
    this.daysChange.emit(arr);
  }

  setBreakTime(index: number, field: 'startTime' | 'endTime', value: string): void {
    const arr = [...this.days()];
    const day = arr[index];
    const breaks = [...day.breaks];
    if (breaks.length === 0) {
      breaks.push({ startTime: '', endTime: '' });
    }
    breaks[0] = { ...breaks[0], [field]: value };
    arr[index] = { ...day, breaks };
    this.daysChange.emit(arr);
  }
}
