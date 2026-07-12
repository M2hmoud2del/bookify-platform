import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MOCK_PROVIDER_SERVICES } from '../shared/provider.models';
import { Service } from '../../../core/models/user.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
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
        @for (service of filteredServices(); track service._id) {
          <div class="service-card">
            <div class="service-header">
              <div class="service-info">
                <h3 class="service-name">{{ service.title }}</h3>
                <p class="service-category">{{ service.category }}</p>
              </div>
              <app-badge [variant]="service.isActive ? 'success' : 'gray'">
                {{ service.isActive ? 'Active' : 'Inactive' }}
              </app-badge>
            </div>

            @if (service.description) {
              <p class="service-description">{{ service.description }}</p>
            }

            <div class="service-meta">
              <div class="meta-item">
                <span class="material-icons-outlined">schedule</span>
                <span>{{ service.durationMinutes }} min</span>
              </div>
              <div class="meta-item price">
                <span class="material-icons-outlined">payments</span>
                <span>{{ service.price | currency }}</span>
              </div>
            </div>

            <div class="service-actions">
              <app-button variant="ghost" size="sm" [routerLink]="['/provider/services', service._id, 'edit']">
                <span class="material-icons-outlined">edit</span>
                Edit
              </app-button>
              <button type="button" class="action-btn" (click)="toggleServiceStatus(service)">
                <span class="material-icons-outlined">{{ service.isActive ? 'toggle_off' : 'toggle_on' }}</span>
                {{ service.isActive ? 'Deactivate' : 'Activate' }}
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

  services = signal<Service[]>(MOCK_PROVIDER_SERVICES);

  filteredServices = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.services();
    return this.services().filter(s => filter === 'active' ? s.isActive : !s.isActive);
  });

  toggleServiceStatus(service: Service): void {
    console.log('Toggle status for:', service._id);
  }

  navigateToCreate(): void {
    console.log('Navigate to create');
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }
}
