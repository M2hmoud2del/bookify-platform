import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <div class="success-page">
      <div class="success-card">
        <div class="success-icon">
          <span class="material-icons-outlined">check_circle</span>
        </div>
        <h1 class="success-title">Booking Confirmed!</h1>
        <p class="success-message">
          Your appointment has been successfully booked. You will receive a confirmation email shortly.
        </p>

        <app-card class="details-card">
          <h2 class="card-title">Booking Details</h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="material-icons-outlined">business</span>
              <div class="detail-content">
                <span class="detail-label">Provider</span>
                <span class="detail-value">Blossom Beauty Salon</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="material-icons-outlined">medical_services</span>
              <div class="detail-content">
                <span class="detail-label">Service</span>
                <span class="detail-value">Haircut & Styling</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="material-icons-outlined">event</span>
              <div class="detail-content">
                <span class="detail-label">Date</span>
                <span class="detail-value">July 15, 2026</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="material-icons-outlined">schedule</span>
              <div class="detail-content">
                <span class="detail-label">Time</span>
                <span class="detail-value">10:00 AM</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="material-icons-outlined">payments</span>
              <div class="detail-content">
                <span class="detail-label">Total</span>
                <span class="detail-value price">$ 65.00</span>
              </div>
            </div>
          </div>
        </app-card>

        <div class="info-banner">
          <span class="material-icons-outlined">notifications</span>
          <span>We'll send you a reminder 24 hours before your appointment.</span>
        </div>

        <div class="actions">
          <app-button variant="primary" routerLink="/customer/appointments">
            View Appointments
          </app-button>
          <app-button variant="outline" routerLink="/customer/dashboard">
            Go to Dashboard
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: calc(100vh - var(--navbar-height));
      padding: var(--space-8);
    }

    .success-page {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .success-card {
      max-width: 480px;
      width: 100%;
      text-align: center;
    }

    .success-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: var(--success-100);
      border-radius: var(--radius-full);
      margin-bottom: var(--space-6);
      animation: pop-in 0.4s ease-out;
    }

    @keyframes pop-in {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }

    :host-context(.dark) .success-icon {
      background: rgba(34, 197, 94, 0.2);
    }

    .success-icon .material-icons-outlined {
      font-size: 2.5rem;
      color: var(--success-500);
    }

    .success-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-3);
    }

    .success-message {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0 0 var(--space-6);
    }

    .details-card {
      text-align: left;
      margin-bottom: var(--space-5);
    }

    .card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
    }

    .details-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .detail-item .material-icons-outlined {
      color: var(--primary-500);
      font-size: 1.25rem;
    }

    .detail-content { flex: 1; }

    .detail-label {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .detail-value {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .detail-value.price {
      color: var(--primary-500);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
    }

    .info-banner {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: var(--primary-50);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-6);
      font-size: var(--font-size-sm);
      color: var(--primary-700);
      text-align: left;
    }

    :host-context(.dark) .info-banner {
      background: rgba(79, 70, 229, 0.1);
      color: var(--primary-300);
    }

    .info-banner .material-icons-outlined {
      font-size: 1.125rem;
      flex-shrink: 0;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    @media (min-width: 480px) {
      .actions {
        flex-direction: row;
        justify-content: center;
      }
    }
  `],
})
export class CheckoutSuccessComponent {}
