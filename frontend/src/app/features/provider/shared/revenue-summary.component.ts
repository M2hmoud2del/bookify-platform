import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueData } from '../shared/provider.models';

@Component({
  selector: 'app-revenue-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue-summary.component.html',
  styleUrl: './revenue-summary.component.css',
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
