import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-checkout-failed',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="failed-page">
      <div class="failed-card">
        <div class="failed-icon">
          <span class="material-icons-outlined">error</span>
        </div>
        <h1 class="failed-title">Payment Failed</h1>
        <p class="failed-message">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>

        <div class="error-details">
          <p class="error-text">
            <span class="material-icons-outlined">info</span>
            Your booking has not been confirmed. No charges were made.
          </p>
        </div>

        <div class="actions">
          <app-button variant="primary" routerLink="/customer/book">
            Try Again
          </app-button>
          <app-button variant="outline" routerLink="/customer/dashboard">
            Back to Dashboard
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

    .failed-page {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .failed-card {
      max-width: 420px;
      width: 100%;
      text-align: center;
    }

    .failed-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: var(--danger-100);
      border-radius: var(--radius-full);
      margin-bottom: var(--space-6);
    }

    :host-context(.dark) .failed-icon {
      background: rgba(239, 68, 68, 0.2);
    }

    .failed-icon .material-icons-outlined {
      font-size: 2.5rem;
      color: var(--danger-500);
    }

    .failed-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-3);
    }

    .failed-message {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0 0 var(--space-6);
    }

    .error-details {
      padding: var(--space-4);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-6);
    }

    :host-context(.dark) .error-details {
      background: var(--gray-800);
    }

    .error-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .error-text .material-icons-outlined {
      font-size: 1rem;
      color: var(--primary-500);
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
export class CheckoutFailedComponent {}
