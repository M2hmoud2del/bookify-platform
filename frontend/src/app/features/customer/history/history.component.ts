import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-history',
  standalone: true,
  imports: [CommonModule, CardComponent, EmptyStateComponent],
  template: `
    <div class="history-page">
      <div class="page-header">
        <h1 class="page-title">Appointment History</h1>
        <p class="page-subtitle">View your past appointments</p>
      </div>
      <app-card>
        <div class="history-list">
          <div class="history-item">
            <div class="history-date">Jun 28, 2026</div>
            <div class="history-info">
              <h3 class="service-name">Facial Treatment</h3>
              <p class="provider-name">Blossom Beauty Salon</p>
            </div>
            <span class="status completed">Completed</span>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .history-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .history-list { display: flex; flex-direction: column; }
    .history-item { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); border-bottom: 1px solid var(--border); }
    .history-date { font-size: var(--font-size-sm); color: var(--text-secondary); min-width: 100px; }
    .history-info { flex: 1; }
    .service-name { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); color: var(--text-primary); margin: 0; }
    .provider-name { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .status { font-size: var(--font-size-xs); padding: var(--space-1) var(--space-2); border-radius: var(--radius-md); }
    .status.completed { background: var(--success-100); color: var(--success-700); }
  `],
})
export class HistoryComponent {}
