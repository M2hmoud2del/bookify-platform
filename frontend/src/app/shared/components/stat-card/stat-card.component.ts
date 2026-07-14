import { Component, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
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
