import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Service } from '../../../core/models/user.model';
import { ProviderProfileApi } from '../profile/provider-profile.api';
import { ProviderServicesApi } from './provider-services.api';

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
  private router = inject(Router);
  private providerProfileApi = inject(ProviderProfileApi);
  private providerServicesApi = inject(ProviderServicesApi);

  activeFilter = signal<'all' | 'active' | 'inactive'>('all');
  loading = signal(false);
  error = signal<string | null>(null);
  services = signal<Service[]>([]);

  filteredServices = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'all') return this.services();
    return this.services().filter(s => filter === 'active' ? s.isActive : !s.isActive);
  });

  constructor() {
    void this.loadServices();
  }

  async loadServices(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const profile = await this.providerProfileApi.getMyProviderProfile();
      const services = await this.providerServicesApi.getProviderServices(profile._id);
      this.services.set(services);
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }

  async toggleServiceStatus(service: Service): Promise<void> {
    this.error.set(null);

    try {
      const updated = await this.providerServicesApi.updateServiceStatus(service._id, !service.isActive);
      this.services.update((items) => items.map((item) => item._id === service._id ? updated : item));
    } catch (err) {
      this.error.set(this.errorMessage(err));
    }
  }

  async deleteService(service: Service): Promise<void> {
    this.error.set(null);

    try {
      await this.providerServicesApi.deleteService(service._id);
      this.services.update((items) => items.filter((item) => item._id !== service._id));
    } catch (err) {
      this.error.set(this.errorMessage(err));
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/provider/services/create']);
  }

  onPageChange(page: number): void {
    console.log('Page changed to:', page);
  }

  private errorMessage(err: unknown): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : 'Unable to load services.');
  }
}
