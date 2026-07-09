import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-provider-appointments',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  template: `
    <div class="appointments-page">
      <div class="page-header">
        <h1 class="page-title">Appointments</h1>
        <p class="page-subtitle">Manage all your appointments</p>
      </div>
      <app-card>
        <div class="appointments-list">
          <div class="appointment-item">
            <div class="appointment-time">
              <span class="time">10:00 AM</span>
              <span class="duration">45 min</span>
            </div>
            <div class="appointment-info">
              <h3 class="service-name">Haircut & Styling</h3>
              <p class="customer-name">Emma Wilson</p>
            </div>
            <app-badge variant="success">Confirmed</app-badge>
            <div class="appointment-actions">
              <button class="action-btn"><span class="material-icons-outlined">check</span></button>
              <button class="action-btn"><span class="material-icons-outlined">close</span></button>
            </div>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .appointments-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .appointments-list { display: flex; flex-direction: column; }
    .appointment-item { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); border-bottom: 1px solid var(--border); }
    .appointment-time { display: flex; flex-direction: column; min-width: 80px; }
    .time { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--text-primary); }
    .duration { font-size: var(--font-size-xs); color: var(--text-secondary); }
    .appointment-info { flex: 1; }
    .service-name { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); color: var(--text-primary); margin: 0; }
    .customer-name { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .appointment-actions { display: flex; gap: var(--space-1); }
    .action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; color: var(--text-secondary); border-radius: var(--radius-md); }
    .action-btn:hover { background: var(--gray-100); color: var(--text-primary); }
  `],
})
export class ProviderAppointmentsComponent {}
