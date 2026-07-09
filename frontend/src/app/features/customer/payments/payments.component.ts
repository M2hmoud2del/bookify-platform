import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-customer-payments',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="payments-page">
      <div class="page-header">
        <h1 class="page-title">Payment History</h1>
        <p class="page-subtitle">View all your transactions</p>
      </div>
      <app-card>
        <div class="payments-list">
          <div class="payment-item">
            <div class="payment-info">
              <h3 class="service-name">Haircut & Styling</h3>
              <p class="provider-name">Blossom Beauty Salon</p>
              <p class="payment-date">Jun 28, 2026</p>
            </div>
            <div class="payment-amount">
              <span class="amount">$65.00</span>
              <span class="status completed">Paid</span>
            </div>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .payments-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .payments-list { display: flex; flex-direction: column; }
    .payment-item { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); border-bottom: 1px solid var(--border); }
    .payment-info { flex: 1; }
    .service-name { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); color: var(--text-primary); margin: 0; }
    .provider-name { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .payment-date { font-size: var(--font-size-xs); color: var(--text-tertiary); margin: var(--space-1) 0 0; }
    .payment-amount { text-align: right; }
    .amount { font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--text-primary); display: block; }
    .status { font-size: var(--font-size-xs); padding: var(--space-1) var(--space-2); border-radius: var(--radius-md); }
    .status.completed { background: var(--success-100); color: var(--success-700); }
  `],
})
export class CustomerPaymentsComponent {}
