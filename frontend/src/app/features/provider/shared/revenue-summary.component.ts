import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueData } from '../shared/provider.models';

@Component({
  selector: 'app-revenue-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="revenue-summary">
      <div class="summary-header">
        <div>
          <h3 class="summary-title">Revenue Overview</h3>
          <p class="summary-period">{{ period() }}</p>
        </div>
        <span class="trend-badge" [class.is-up]="trend() >= 0">
          <span class="material-icons-outlined">{{ trend() >= 0 ? 'trending_up' : 'trending_down' }}</span>
          {{ Math.abs(trend()) }}%
        </span>
      </div>

      <div class="summary-stats">
        <div class="stat-block">
          <span class="stat-value">$ {{ totalRevenue().toLocaleString() }}</span>
          <span class="stat-label">Total Revenue</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <span class="stat-value">{{ totalAppointments() }}</span>
          <span class="stat-label">Appointments</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <span class="stat-value">$ {{ averageRevenue().toFixed(0) }}</span>
          <span class="stat-label">Avg / Month</span>
        </div>
      </div>

      <div class="chart">
        @for (item of data(); track item.month) {
          <div class="chart-bar-wrap">
            <div class="chart-bar-container">
              <div
                class="chart-bar"
                [style.height.%]="getBarHeight(item.revenue)"
                [title]="item.month + ': $' + item.revenue"
              ></div>
            </div>
            <span class="chart-label">{{ item.month }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .revenue-summary {
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .revenue-summary {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .summary-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--space-5);
    }

    .summary-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .summary-period {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .trend-badge {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: var(--space-1) var(--space-2);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-md);
      background: var(--success-100);
      color: var(--success-600);
    }

    .trend-badge.is-up { background: var(--success-100); color: var(--success-600); }
    .trend-badge:not(.is-up) { background: var(--danger-100); color: var(--danger-600); }

    :host-context(.dark) .trend-badge.is-up { background: rgba(34, 197, 94, 0.15); color: var(--success-400); }
    :host-context(.dark) .trend-badge:not(.is-up) { background: rgba(239, 68, 68, 0.15); color: var(--danger-400); }

    .trend-badge .material-icons-outlined { font-size: 1rem; }

    .summary-stats {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }

    .stat-block {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .stat-divider {
      width: 1px;
      height: 36px;
      background: var(--border);
    }

    :host-context(.dark) .stat-divider { background: var(--gray-700); }

    .stat-value {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .chart {
      display: flex;
      align-items: flex-end;
      gap: var(--space-2);
      height: 120px;
    }

    .chart-bar-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }

    .chart-bar-container {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .chart-bar {
      width: 70%;
      background: linear-gradient(180deg, var(--primary-400), var(--primary-600));
      border-radius: var(--radius-md) var(--radius-md) 0 0;
      transition: height var(--transition-slow);
      min-height: 4px;
    }

    :host-context(.dark) .chart-bar {
      background: linear-gradient(180deg, var(--primary-500), var(--primary-700));
    }

    .chart-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }
  `],
})
export class RevenueSummaryComponent {
  data = input.required<RevenueData[]>();
  period = input('Last 7 months');
  trend = input(15);

  Math = Math;

  totalRevenue = () => this.data().reduce((sum, d) => sum + d.revenue, 0);
  totalAppointments = () => this.data().reduce((sum, d) => sum + d.appointments, 0);
  averageRevenue = () => this.totalRevenue() / this.data().length;

  getBarHeight(value: number): number {
    const max = Math.max(...this.data().map(d => d.revenue));
    return max > 0 ? (value / max) * 100 : 0;
  }
}
