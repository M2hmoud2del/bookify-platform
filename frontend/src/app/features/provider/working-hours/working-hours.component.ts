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
  template: `
    <div class="working-hours-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Working Hours & Availability</h1>
          <p class="page-subtitle">Set when customers can book appointments</p>
        </div>
        <app-button variant="primary" (onClick)="save()">
          <span class="material-icons-outlined">save</span>
          Save Changes
        </app-button>
      </div>

      <!-- Working Hours -->
      <app-card title="Weekly Working Hours">
        <div card-header>
          <span class="card-hint">Set your regular working hours for each day of the week</span>
        </div>
        <app-working-hours-table
          [days]="workingDays()"
          (daysChange)="onDaysChange($event)"
        />
      </app-card>

      <!-- Availability Calendar -->
      <div class="availability-section">
        <app-card title="Date-Specific Availability">
          <div card-header>
            <span class="card-hint">Block specific dates for holidays or time off</span>
          </div>
          <div class="avail-grid">
            <app-availability-calendar
              [blockedDates]="blockedDates()"
              [appointmentCounts]="appointmentCounts()"
              (dateSelect)="onDateSelect($event)"
            />

            <div class="blocked-list">
              <h3 class="blocked-title">Blocked Dates</h3>
              @if (blockedDates().length > 0) {
                <div class="blocked-items">
                  @for (date of blockedDates(); track date) {
                    <div class="blocked-item">
                      <span class="material-icons-outlined">event_busy</span>
                      <span>{{ formatDate(date) }}</span>
                      <button type="button" class="remove-btn" (click)="unblockDate(date)">
                        <span class="material-icons-outlined">close</span>
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <p class="no-blocked">No blocked dates. Click a date on the calendar to block it.</p>
              }

              <div class="quick-actions">
                <h4 class="quick-title">Quick Block</h4>
                <div class="quick-buttons">
                  <button type="button" class="quick-btn" (click)="blockRange('weekend')">
                    <span class="material-icons-outlined">weekend</span>
                    All Weekends
                  </button>
                  <button type="button" class="quick-btn" (click)="blockRange('holidays')">
                    <span class="material-icons-outlined">celebration</span>
                    Holidays
                  </button>
                </div>
              </div>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .working-hours-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .card-hint {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .availability-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .avail-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-5);
    }

    @media (min-width: 768px) {
      .avail-grid { grid-template-columns: 1fr 1fr; }
    }

    .blocked-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .blocked-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .blocked-items {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .blocked-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: var(--danger-50);
      border: 1px solid var(--danger-200);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      color: var(--danger-700);
    }

    :host-context(.dark) .blocked-item {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.2);
      color: var(--danger-400);
    }

    .blocked-item .material-icons-outlined { font-size: 1.125rem; }

    .remove-btn {
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      color: var(--danger-500);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: background var(--transition-fast);
    }

    .remove-btn:hover { background: rgba(239, 68, 68, 0.1); }
    .remove-btn .material-icons-outlined { font-size: 1rem; }

    .no-blocked {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      padding: var(--space-4);
      text-align: center;
      background: var(--gray-50);
      border-radius: var(--radius-lg);
    }

    :host-context(.dark) .no-blocked { background: var(--gray-900); }

    .quick-actions {
      padding-top: var(--space-3);
      border-top: 1px solid var(--border);
    }

    :host-context(.dark) .quick-actions { border-color: var(--gray-700); }

    .quick-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-2);
    }

    .quick-buttons {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .quick-btn {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .quick-btn { background: var(--gray-900); border-color: var(--gray-700); }
    .quick-btn:hover { border-color: var(--primary-300); color: var(--primary-600); }
    .quick-btn .material-icons-outlined { font-size: 1rem; }
  `],
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
