import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { WorkingHour } from '../../../core/models/user.model';

@Component({
  selector: 'app-working-hours-table',
  standalone: true,
  imports: [CommonModule, FormsModule, BadgeComponent],
  template: `
    <div class="hours-table">
      @for (day of days(); track day._id; let i = $index) {
        <div class="day-row" [class.is-disabled]="day.isClosed">
          <div class="day-info">
            <button
              type="button"
              class="toggle-switch"
              [class.is-on]="!day.isClosed"
              (click)="toggleDay(i)"
              [attr.aria-label]="'Toggle ' + day.dayOfWeek"
            >
              <span class="toggle-slider"></span>
            </button>
            <span class="day-name">{{ day.dayOfWeek | titlecase }}</span>
            @if (!day.isClosed) {
              <app-badge variant="success" size="sm">Open</app-badge>
            } @else {
              <app-badge variant="gray" size="sm">Closed</app-badge>
            }
          </div>

          @if (!day.isClosed) {
            <div class="hours-inputs">
              <div class="time-field">
                <label class="time-label">Open</label>
                <input
                  type="time"
                  class="time-input"
                  [(ngModel)]="days()[i].startTime"
                  name="start_{{ day.dayOfWeek }}"
                />
              </div>
              <span class="separator">to</span>
              <div class="time-field">
                <label class="time-label">Close</label>
                <input
                  type="time"
                  class="time-input"
                  [(ngModel)]="days()[i].endTime"
                  name="end_{{ day.dayOfWeek }}"
                />
              </div>
              <button
                type="button"
                class="break-btn"
                [class.is-active]="day.breaks.length > 0"
                (click)="toggleBreak(i)"
                title="Toggle lunch break"
              >
                <span class="material-icons-outlined">restaurant</span>
              </button>
            </div>

            @if (day.breaks.length > 0) {
              <div class="break-section">
                <span class="break-label">
                  <span class="material-icons-outlined">restaurant</span>
                  Break
                </span>
                <div class="break-inputs">
                  <input
                    type="time"
                    class="time-input"
                    [ngModel]="days()[i].breaks[0]?.startTime ?? ''"
                    (ngModelChange)="setBreakTime(i, 'startTime', $event)"
                    name="break_start_{{ day.dayOfWeek }}"
                  />
                  <span class="separator">to</span>
                  <input
                    type="time"
                    class="time-input"
                    [ngModel]="days()[i].breaks[0]?.endTime ?? ''"
                    (ngModelChange)="setBreakTime(i, 'endTime', $event)"
                    name="break_end_{{ day.dayOfWeek }}"
                  />
                </div>
              </div>
            }
          } @else {
            <div class="closed-message">
              <span class="material-icons-outlined">bedtime</span>
              Not available
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .hours-table {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .day-row {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      flex-wrap: wrap;
      transition: opacity var(--transition-fast);
    }

    :host-context(.dark) .day-row { border-color: var(--gray-700); }
    .day-row.is-disabled { opacity: 0.6; }

    .day-info {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      min-width: 180px;
    }

    .toggle-switch {
      position: relative;
      width: 40px;
      height: 22px;
      background: var(--gray-200);
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: background var(--transition-fast);
      flex-shrink: 0;
    }

    :host-context(.dark) .toggle-switch { background: var(--gray-600); }
    .toggle-switch.is-on { background: var(--success-500); }

    .toggle-slider {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 18px;
      height: 18px;
      background: #fff;
      border-radius: var(--radius-full);
      transition: transform var(--transition-fast);
    }

    .toggle-switch.is-on .toggle-slider { transform: translateX(18px); }

    .day-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .hours-inputs {
      display: flex;
      align-items: flex-end;
      gap: var(--space-2);
    }

    .time-field {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .time-label {
      font-size: 10px;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }

    .time-input {
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      outline: none;
      transition: border-color var(--transition-fast);
    }

    :host-context(.dark) .time-input {
      background: var(--gray-900);
      border-color: var(--gray-700);
      color: var(--gray-100);
    }

    .time-input:focus { border-color: var(--primary-500); }

    .separator {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      padding-bottom: var(--space-1);
    }

    .break-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: var(--gray-100);
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      margin-bottom: 2px;
    }

    :host-context(.dark) .break-btn { background: var(--gray-700); }
    .break-btn:hover { background: var(--primary-100); color: var(--primary-600); }
    .break-btn.is-active { background: var(--warning-100); color: var(--warning-600); }
    :host-context(.dark) .break-btn.is-active { background: rgba(245, 158, 11, 0.15); color: var(--warning-400); }

    .break-section {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
      padding-left: 58px;
      margin-top: var(--space-2);
    }

    .break-label {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-xs);
      color: var(--warning-600);
      font-weight: var(--font-weight-medium);
    }

    :host-context(.dark) .break-label { color: var(--warning-400); }

    .break-inputs {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .closed-message {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .closed-message .material-icons-outlined { font-size: 1rem; }
  `],
})
export class WorkingHoursTableComponent {
  days = input.required<WorkingHour[]>();
  daysChange = output<WorkingHour[]>();

  toggleDay(index: number): void {
    const arr = [...this.days()];
    arr[index] = { ...arr[index], isClosed: !arr[index].isClosed };
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
