import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, AvatarComponent, BadgeComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <div class="appointments-page">
      <div class="page-header">
        <h1 class="page-title">Appointments</h1>
        <p class="page-subtitle">Manage your upcoming and past appointments</p>
      </div>
      <app-card>
        <div class="appointments-list">
          <div class="appointment-item">
            <div class="appointment-date">
              <span class="date-day">02</span>
              <span class="date-month">Jul</span>
            </div>
            <div class="appointment-info">
              <h3 class="service-name">Haircut & Styling</h3>
              <div class="provider-info">
                <app-avatar name="Blossom Beauty" size="sm" />
                <span>Blossom Beauty Salon</span>
              </div>
            </div>
            <div class="appointment-meta">
              <span class="time">10:00 AM</span>
              <app-badge variant="success">Confirmed</app-badge>
            </div>
            <div class="appointment-actions">
              <app-button variant="ghost" size="sm">Reschedule</app-button>
              <app-button variant="ghost" size="sm">Cancel</app-button>
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
    .appointment-item:last-child { border-bottom: none; }
    .appointment-date { display: flex; flex-direction: column; align-items: center; padding: var(--space-2); background: var(--gray-100); border-radius: var(--radius-lg); min-width: 56px; }
    .date-day { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--text-primary); }
    .date-month { font-size: var(--font-size-xs); color: var(--text-secondary); text-transform: uppercase; }
    .appointment-info { flex: 1; min-width: 0; }
    .service-name { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); color: var(--text-primary); margin: 0 0 var(--space-1); }
    .provider-info { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); color: var(--text-secondary); }
    .appointment-meta { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-2); }
    .time { font-size: var(--font-size-sm); color: var(--text-secondary); }
    .appointment-actions { display: flex; gap: var(--space-2); }
  `],
})
export class CustomerAppointmentsComponent {}
