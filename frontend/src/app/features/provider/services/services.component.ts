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
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
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
