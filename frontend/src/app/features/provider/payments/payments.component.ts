import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-provider-payments',
  standalone: true,
  imports: [CommonModule, CardComponent, StatCardComponent, ButtonComponent],
  template: `
    <div class="payments-page">
      <div class="page-header">
        <h1 class="page-title">Payments</h1>
        <p class="page-subtitle">Track your earnings and payouts</p>
      </div>
      <div class="stats-grid">
        <app-stat-card icon="account_balance_wallet" value="$3,250" label="This Month" [trend]="23" color="success" />
        <app-stat-card icon="pending" value="$180" label="Pending" color="warning" />
        <app-stat-card icon="check_circle" value="$15,400" label="Total Earned" color="primary" />
      </div>
      <app-card title="Recent Transactions">
        <div class="transactions-list">
          @for (tx of transactions; track tx.id) {
            <div class="tx-item">
              <div class="tx-info">
                <h3 class="tx-service">{{ tx.service }}</h3>
                <p class="tx-customer">{{ tx.customer }}</p>
                <p class="tx-date">{{ tx.date }}</p>
              </div>
              <div class="tx-amount">
                <span class="amount">+{{ tx.amount | currency }}</span>
                <span class="status" [ngClass]="tx.status">{{ tx.status }}</span>
              </div>
            </div>
          }
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .payments-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .stats-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
    @media (min-width: 640px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
    .transactions-list { display: flex; flex-direction: column; }
    .tx-item { display: flex; align-items: center; justify-content: space-between; padding: var(--space-4); border-bottom: 1px solid var(--border); }
    .tx-info { flex: 1; }
    .tx-service { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); color: var(--text-primary); margin: 0; }
    .tx-customer { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .tx-date { font-size: var(--font-size-xs); color: var(--text-tertiary); margin: var(--space-1) 0 0; }
    .tx-amount { text-align: right; }
    .amount { display: block; font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--success-500); }
    .status { font-size: var(--font-size-xs); padding: var(--space-1) var(--space-2); border-radius: var(--radius-md); }
    .status.completed { background: var(--success-100); color: var(--success-700); }
    .status.pending { background: var(--warning-100); color: var(--warning-700); }
  `],
})
export class ProviderPaymentsComponent {
  transactions = [
    { id: '1', service: 'Haircut & Styling', customer: 'Emma Wilson', amount: 65, status: 'completed', date: 'Jul 1, 2026' },
    { id: '2', service: 'Hair Coloring', customer: 'James Brown', amount: 120, status: 'completed', date: 'Jun 30, 2026' },
    { id: '3', service: 'Facial Treatment', customer: 'Sarah Davis', amount: 85, status: 'pending', date: 'Jun 28, 2026' },
  ];
}
