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
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
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
