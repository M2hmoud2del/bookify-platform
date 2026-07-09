import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-provider-customers',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, AvatarComponent, BadgeComponent, ButtonComponent, SearchComponent, PaginationComponent],
  template: `
    <div class="customers-page">
      <div class="page-header">
        <h1 class="page-title">Customers</h1>
        <p class="page-subtitle">View and manage your customer base</p>
      </div>
      <div class="filters-bar">
        <app-search placeholder="Search customers..." class="search-input" />
      </div>
      <app-card>
        <div class="customers-list">
          @for (customer of customers; track customer.id) {
            <div class="customer-item">
              <app-avatar [name]="customer.name" size="md" />
              <div class="customer-info">
                <h3 class="customer-name">{{ customer.name }}</h3>
                <p class="customer-email">{{ customer.email }}</p>
              </div>
              <div class="customer-stats">
                <span class="stat"><strong>{{ customer.appointments }}</strong> appointments</span>
                <span class="stat"><strong>{{ customer.spent | currency }}</strong> spent</span>
              </div>
              <app-button variant="outline" size="sm" [routerLink]="['/provider/calendar']">Book</app-button>
            </div>
          }
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .customers-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .filters-bar { display: flex; gap: var(--space-4); }
    .search-input { max-width: 320px; }
    .customers-list { display: flex; flex-direction: column; }
    .customer-item { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); border-bottom: 1px solid var(--border); }
    .customer-info { flex: 1; }
    .customer-name { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); color: var(--text-primary); margin: 0; }
    .customer-email { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .customer-stats { display: flex; gap: var(--space-4); font-size: var(--font-size-sm); color: var(--text-secondary); }
    .stat strong { color: var(--text-primary); }
  `],
})
export class CustomersComponent {
  customers = [
    { id: '1', name: 'Emma Wilson', email: 'emma.wilson@email.com', appointments: 8, spent: 520 },
    { id: '2', name: 'James Brown', email: 'james.brown@email.com', appointments: 5, spent: 380 },
    { id: '3', name: 'Sarah Davis', email: 'sarah.davis@email.com', appointments: 3, spent: 150 },
  ];
}
