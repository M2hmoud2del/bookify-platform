import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    AvatarComponent,
    BadgeComponent,
    EmptyStateComponent,
    SearchComponent,
    PaginationComponent,
  ],
  template: `
    <div class="services-page">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Services</h1>
          <p class="page-subtitle">Manage your service offerings and pricing.</p>
        </div>
        <app-button variant="primary" routerLink="/provider/services/create">
          <span class="material-icons-outlined">add</span>
          Add Service
        </app-button>
      </div>

      <div class="filters-bar">
        <app-search placeholder="Search services..." class="search-input" />
        <div class="filter-actions">
          <button type="button" class="filter-btn" [ngClass]="{ 'is-active': activeFilter() === 'all' }" (click)="activeFilter.set('all')">
            All
          </button>
          <button type="button" class="filter-btn" [ngClass]="{ 'is-active': activeFilter() === 'active' }" (click)="activeFilter.set('active')">
            Active
          </button>
          <button type="button" class="filter-btn" [ngClass]="{ 'is-active': activeFilter() === 'inactive' }" (click)="activeFilter.set('inactive')">
            Inactive
          </button>
        </div>
      </div>

      <div class="services-grid">
        @for (service of filteredServices(); track service.id) {
          <div class="service-card">
            <div class="service-header">
              <div class="service-info">
                <h3 class="service-name">{{ service.name }}</h3>
                <p class="service-category">{{ service.category }}</p>
              </div>
              <app-badge [variant]="service.is_active ? 'success' : 'gray'">
                {{ service.is_active ? 'Active' : 'Inactive' }}
              </app-badge>
            </div>

            @if (service.description) {
              <p class="service-description">{{ service.description }}</p>
            }

            <div class="service-meta">
              <div class="meta-item">
                <span class="material-icons-outlined">schedule</span>
                <span>{{ service.duration_minutes }} min</span>
              </div>
              <div class="meta-item price">
                <span class="material-icons-outlined">payments</span>
                <span>{{ service.price | currency }}</span>
              </div>
            </div>

            <div class="service-stats">
              <div class="stat">
                <span class="stat-value">{{ service.total_bookings }}</span>
                <span class="stat-label">Bookings</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ service.total_revenue | currency }}</span>
                <span class="stat-label">Revenue</span>
              </div>
            </div>

            <div class="service-actions">
              <app-button variant="ghost" size="sm" [routerLink]="['/provider/services', service.id, 'edit']">
                <span class="material-icons-outlined">edit</span>
                Edit
              </app-button>
              <button type="button" class="action-btn" (click)="toggleServiceStatus(service)">
                <span class="material-icons-outlined">{{ service.is_active ? 'toggle_off' : 'toggle_on' }}</span>
                {{ service.is_active ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
        } @empty {
          <app-empty-state
            icon="medical_services"
            title="No services found"
            description="Get started by creating your first service offering."
            actionLabel="Add Service"
            (action)="navigateToCreate()"
          />
        }
      </div>

      <app-pagination [currentPage]="1" [totalPages]="3" (pageChange)="onPageChange($event)" />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .services-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .page-header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .filters-bar {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .filters-bar {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .search-input {
      max-width: 320px;
    }

    .filter-actions {
      display: flex;
      gap: var(--space-2);
    }

    .filter-btn {
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      background: var(--gray-100);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .filter-btn {
      background: var(--gray-800);
    }

    .filter-btn:hover {
      background: var(--gray-200);
    }

    :host-context(.dark) .filter-btn:hover {
      background: var(--gray-700);
    }

    .filter-btn.is-active {
      background: var(--primary-500);
      color: white;
    }

    .services-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .services-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .service-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      transition: all var(--transition-normal);
    }

    :host-context(.dark) .service-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .service-card:hover {
      box-shadow: var(--shadow-md);
    }

    .service-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }

    .service-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .service-category {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .service-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--space-4);
      line-height: var(--line-height-relaxed);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .service-meta {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .meta-item.price {
      color: var(--primary-500);
      font-weight: var(--font-weight-semibold);
    }

    .meta-item .material-icons-outlined {
      font-size: 1.125rem;
    }

    .service-stats {
      display: flex;
      gap: var(--space-6);
      padding: var(--space-3);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-4);
    }

    :host-context(.dark) .service-stats {
      background: var(--gray-900);
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .service-actions {
      display: flex;
      gap: var(--space-2);
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      background: var(--gray-100);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .action-btn {
      background: var(--gray-700);
    }

    .action-btn:hover {
      background: var(--gray-200);
      color: var(--text-primary);
    }

    :host-context(.dark) .action-btn:hover {
      background: var(--gray-600);
    }

    .action-btn .material-icons-outlined {
      font-size: 1.125rem;
    }
  `],
})
export class ServicesComponent {
  activeFilter = signal<'all' | 'active' | 'inactive'>('all');

  services = signal([
    {
      id: '1',
      name: 'Haircut & Styling',
      description: 'Professional haircut and styling session tailored to your preferences.',
      category: 'Hair Care',
      duration_minutes: 45,
      price: 65,
      is_active: true,
      total_bookings: 128,
      total_revenue: 8320,
    },
    {
      id: '2',
      name: 'Hair Coloring',
      description: 'Full hair coloring service with premium products.',
      category: 'Hair Care',
      duration_minutes: 90,
      price: 120,
      is_active: true,
      total_bookings: 56,
      total_revenue: 6720,
    },
    {
      id: '3',
      name: 'Beard Trim',
      description: 'Professional beard grooming and shaping.',
      category: 'Grooming',
      duration_minutes: 30,
      price: 35,
      is_active: true,
      total_bookings: 84,
      total_revenue: 2940,
    },
    {
      id: '4',
      name: 'Facial Treatment',
      description: 'Deep cleansing facial treatment for healthy skin.',
      category: 'Skincare',
      duration_minutes: 60,
      price: 85,
      is_active: false,
      total_bookings: 32,
      total_revenue: 2720,
    },
  ]);

  filteredServices = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.services();
    return this.services().filter(s => filter === 'active' ? s.is_active : !s.is_active);
  });

  toggleServiceStatus(service: any): void {
    console.log('Toggle status for:', service.id);
  }

  navigateToCreate(): void {
    console.log('Navigate to create');
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }
}
