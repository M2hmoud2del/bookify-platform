import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-provider-payments',
  standalone: true,
  imports: [CommonModule, CardComponent, StatCardComponent, ButtonComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class ProviderPaymentsComponent {
  transactions = [
    { id: '1', service: 'Haircut & Styling', customer: 'Emma Wilson', amount: 65, status: 'completed', date: 'Jul 1, 2026' },
    { id: '2', service: 'Hair Coloring', customer: 'James Brown', amount: 120, status: 'completed', date: 'Jun 30, 2026' },
    { id: '3', service: 'Facial Treatment', customer: 'Sarah Davis', amount: 85, status: 'pending', date: 'Jun 28, 2026' },
  ];
}
