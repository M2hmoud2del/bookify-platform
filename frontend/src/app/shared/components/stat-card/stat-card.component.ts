import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-icon" [style.background]="iconBackground()" [style.color]="iconColor()">
          <span class="material-icons-outlined">{{ icon() }}</span>
        </span>
        <div class="stat-trend" [ngClass]="trendClass()">
          <span class="material-icons-outlined">{{ trendIcon() }}</span>
          <span>{{ trend() }}%</span>
        </div>
      </div>
      <div class="stat-body">
        <p class="stat-value">{{ value() }}</p>
        <p class="stat-label">{{ label() }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      transition: all var(--transition-normal);
    }

    :host-context(.dark) .stat-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .stat-card:hover {
      box-shadow: var(--shadow-md);
    }

    .stat-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--space-4);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-xl);
    }

    .stat-icon .material-icons-outlined {
      font-size: 1.5rem;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    .stat-trend .material-icons-outlined {
      font-size: 1rem;
    }

    .trend-up {
      background: var(--success-100);
      color: var(--success-700);
    }

    :host-context(.dark) .trend-up {
      background: rgba(34, 197, 94, 0.2);
      color: var(--success-500);
    }

    .trend-down {
      background: var(--danger-100);
      color: var(--danger-700);
    }

    :host-context(.dark) .trend-down {
      background: rgba(239, 68, 68, 0.2);
      color: var(--danger-500);
    }

    .trend-neutral {
      background: var(--gray-100);
      color: var(--gray-600);
    }

    :host-context(.dark) .trend-neutral {
      background: var(--gray-700);
      color: var(--gray-400);
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }
  `],
})
export class StatCardComponent {
  icon = input<string>('insights');
  value = input<string>('0');
  label = input<string>('Metric');
  trend = input<number>(0);
  color = input<'primary' | 'accent' | 'success' | 'warning' | 'danger'>('primary');

  iconBackground = computed(() => {
    switch (this.color()) {
      case 'primary':
        return 'var(--primary-100)';
      case 'accent':
        return 'var(--accent-100)';
      case 'success':
        return 'var(--success-100)';
      case 'warning':
        return 'var(--warning-100)';
      case 'danger':
        return 'var(--danger-100)';
      default:
        return 'var(--gray-100)';
    }
  });

  iconColor = computed(() => {
    switch (this.color()) {
      case 'primary':
        return 'var(--primary-600)';
      case 'accent':
        return 'var(--accent-600)';
      case 'success':
        return 'var(--success-600)';
      case 'warning':
        return 'var(--warning-600)';
      case 'danger':
        return 'var(--danger-600)';
      default:
        return 'var(--gray-600)';
    }
  });

  trendIcon = computed(() => {
    return this.trend() >= 0 ? 'trending_up' : 'trending_down';
  });

  trendClass = computed(() => {
    if (this.trend() >= 0) return 'trend-up';
    return 'trend-down';
  });
}
