import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, AvatarComponent, BadgeComponent, ButtonComponent],
  template: `
    <div class="appointment-detail-page">
      <div class="page-header">
        <a routerLink="/customer/appointments" class="back-link">
          <span class="material-icons-outlined">arrow_back</span>
          Back to Appointments
        </a>
        <h1 class="page-title">Appointment Details</h1>
      </div>
      <app-card>
        <div class="detail-grid">
          <div class="detail-section">
            <h2 class="section-title">Service</h2>
            <div class="provider-info">
              <app-avatar name="Blossom Beauty" size="lg" />
              <div class="provider-details">
                <h3 class="service-name">Haircut & Styling</h3>
                <p class="provider-name">Blossom Beauty Salon</p>
              </div>
            </div>
          </div>
          <div class="detail-section">
            <h2 class="section-title">Date & Time</h2>
            <div class="datetime-info">
              <span class="material-icons-outlined">event</span>
              <div class="datetime-text">
                <p class="date">July 2, 2026</p>
                <p class="time">10:00 AM - 10:45 AM</p>
              </div>
            </div>
          </div>
          <div class="detail-section">
            <h2 class="section-title">Status</h2>
            <app-badge variant="success">Confirmed</app-badge>
          </div>
          <div class="detail-section">
            <h2 class="section-title">Payment</h2>
            <p class="amount">$65.00</p>
            <app-badge variant="success">Paid</app-badge>
          </div>
        </div>
      </app-card>
      <div class="actions">
        <app-button variant="outline">Reschedule</app-button>
        <app-button variant="danger">Cancel Appointment</app-button>
      </div>
    </div>
  `,
  styles: [`
    .appointment-detail-page { display: flex; flex-direction: column; gap: var(--space-6); max-width: 600px; }
    .page-header { display: flex; flex-direction: column; gap: var(--space-3); }
    .back-link { display: flex; align-items: center; gap: var(--space-1); font-size: var(--font-size-sm); color: var(--text-secondary); text-decoration: none; }
    .back-link:hover { color: var(--primary-500); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
    @media (max-width: 639px) { .detail-grid { grid-template-columns: 1fr; } }
    .section-title { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--text-secondary); margin: 0 0 var(--space-2); }
    .provider-info { display: flex; align-items: center; gap: var(--space-3); }
    .service-name { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin: 0; }
    .provider-name { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .datetime-info { display: flex; align-items: center; gap: var(--space-3); }
    .datetime-info .material-icons-outlined { color: var(--primary-500); }
    .date { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); color: var(--text-primary); margin: 0; }
    .time { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .amount { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0 0 var(--space-2); }
    .actions { display: flex; gap: var(--space-3); }
  `],
})
export class AppointmentDetailComponent {}
