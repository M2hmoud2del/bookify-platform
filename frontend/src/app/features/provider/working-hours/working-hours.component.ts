import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-working-hours',
  standalone: true,
  imports: [CommonModule, CardComponent, AvatarComponent, BadgeComponent, ButtonComponent],
  template: `
    <div class="working-hours-page">
      <div class="page-header">
        <h1 class="page-title">Working Hours</h1>
        <p class="page-subtitle">Set your availability for bookings</p>
      </div>
      <app-card>
        <div class="hours-list">
          @for (day of days; track day.name) {
            <div class="day-row">
              <div class="day-info">
                <span class="day-name">{{ day.name }}</span>
                <app-badge variant="success">Open</app-badge>
              </div>
              <div class="hours-inputs">
                <input type="time" value="09:00" class="time-input" />
                <span class="separator">to</span>
                <input type="time" value="17:00" class="time-input" />
                <button class="toggle-btn">
                  <span class="material-icons-outlined">toggle_on</span>
                </button>
              </div>
            </div>
          }
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .working-hours-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .hours-list { display: flex; flex-direction: column; }
    .day-row { display: flex; align-items: center; justify-content: space-between; padding: var(--space-3) 0; border-bottom: 1px solid var(--border); }
    .day-info { display: flex; align-items: center; gap: var(--space-3); min-width: 120px; }
    .day-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-primary); }
    .hours-inputs { display: flex; align-items: center; gap: var(--space-2); }
    .time-input { padding: var(--space-2); font-size: var(--font-size-sm); background: var(--gray-50); border: 1px solid var(--border); border-radius: var(--radius-md); }
    .separator { font-size: var(--font-size-sm); color: var(--text-secondary); }
    .toggle-btn { display: flex; color: var(--success-500); padding: var(--space-1); }
  `],
})
export class WorkingHoursComponent {
  days = [
    { name: 'Monday', active: true },
    { name: 'Tuesday', active: true },
    { name: 'Wednesday', active: true },
    { name: 'Thursday', active: true },
    { name: 'Friday', active: true },
    { name: 'Saturday', active: false },
    { name: 'Sunday', active: false },
  ];
}
