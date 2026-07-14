import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicNavbarComponent } from '../../../layouts/public-layout/public-navbar.component';
import { FooterComponent } from '../../../layouts/public-layout/footer.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ProviderCardComponent } from '../shared/provider-card.component';
import { CategoryFiltersComponent } from '../shared/category-filters.component';
import { SearchFiltersComponent } from '../shared/search-filters.component';
import { PublicProvider } from '../shared/public.models';
import { ProviderProfileApi } from '../../provider/profile/provider-profile.api';
import { ProviderServicesApi } from '../../provider/services/provider-services.api';

@Component({
  selector: 'app-search-providers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PublicNavbarComponent,
    FooterComponent,
    ButtonComponent,
    EmptyStateComponent,
    PaginationComponent,
    ProviderCardComponent,
    CategoryFiltersComponent,
    SearchFiltersComponent,
  ],
  templateUrl: './search-providers.component.html',
  styleUrl: './search-providers.component.css',
})
export class SearchProvidersComponent {
  private providerProfileApi = inject(ProviderProfileApi);
  private providerServicesApi = inject(ProviderServicesApi);

  activeCategory = signal('all');
  searchQuery = signal('');
  minRating = signal(0);
  maxPrice = signal<number | null>(null);
  sortBy = signal('rating');
  currentPage = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);
  providers = signal<PublicProvider[]>([]);
  pageSize = 6;

  hasActiveFilters = computed(() => {
    return (
      this.activeCategory() !== 'all' ||
      this.searchQuery().trim() !== '' ||
      this.minRating() > 0 ||
      this.maxPrice() !== null
    );
  });

  filteredProviders = computed<PublicProvider[]>(() => {
    let result = [...this.providers()];

    const cat = this.activeCategory();
    if (cat !== 'all') {
      result = result.filter(p => p.profile.category === cat);
    }

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.profile.businessName.toLowerCase().includes(q) ||
        (p.profile.category ?? '').toLowerCase().includes(q) ||
        (p.profile.city ?? '').toLowerCase().includes(q) ||
        p.services.some(s => s.title.toLowerCase().includes(q))
      );
    }

    const minR = this.minRating();
    if (minR > 0) {
      result = result.filter(p => p.profile.ratingAverage >= minR);
    }

    const maxP = this.maxPrice();
    if (maxP !== null) {
      result = result.filter(p =>
        p.services.some(s => s.price <= maxP!)
      );
    }

    const sort = this.sortBy();
    switch (sort) {
      case 'rating':     result.sort((a, b) => b.profile.ratingAverage - a.profile.ratingAverage); break;
      case 'reviews':    result.sort((a, b) => b.profile.ratingCount - a.profile.ratingCount); break;
      case 'price_low':  result.sort((a, b) => this.lowestPrice(a) - this.lowestPrice(b)); break;
      case 'price_high': result.sort((a, b) => this.highestPrice(b) - this.highestPrice(a)); break;
    }

    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredProviders().length / this.pageSize));

  pagedProviders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProviders().slice(start, start + this.pageSize);
  });

  constructor() {
    void this.loadProviders();
  }

  async loadProviders(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const providers = await this.providerProfileApi.getProviders();
      const withServices = await Promise.all(
        providers.map(async (provider) => ({
          ...provider,
          services: await this.providerServicesApi.getProviderServices(provider.profile._id),
        }))
      );
      this.providers.set(withServices as PublicProvider[]);
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }

  onCategoryChange(cat: string): void {
    this.activeCategory.set(cat);
    this.currentPage.set(1);
  }

  onQueryChange(q: string): void {
    this.searchQuery.set(q);
    this.currentPage.set(1);
  }

  onMinRatingChange(r: number): void {
    this.minRating.set(r);
    this.currentPage.set(1);
  }

  onMaxPriceChange(p: number | null): void {
    this.maxPrice.set(p);
    this.currentPage.set(1);
  }

  onSortChange(s: string): void {
    this.sortBy.set(s);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.activeCategory.set('all');
    this.searchQuery.set('');
    this.minRating.set(0);
    this.maxPrice.set(null);
    this.sortBy.set('rating');
    this.currentPage.set(1);
  }

  private lowestPrice(provider: PublicProvider): number {
    return provider.services.length ? Math.min(...provider.services.map(s => s.price)) : Number.MAX_SAFE_INTEGER;
  }

  private highestPrice(provider: PublicProvider): number {
    return provider.services.length ? Math.max(...provider.services.map(s => s.price)) : 0;
  }

  private errorMessage(err: unknown): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : 'Unable to load providers.');
  }
}
