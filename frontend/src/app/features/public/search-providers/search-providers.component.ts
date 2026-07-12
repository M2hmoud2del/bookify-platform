import { Component, signal, computed } from '@angular/core';
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
import { MOCK_PROVIDERS, PublicProvider } from '../shared/public.models';

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
  template: `
    <app-public-navbar />

    <div class="search-page">
      <div class="container">
        <!-- Page header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Find Providers</h1>
            <p class="page-subtitle">
              Discover and book appointments with top-rated professionals near you
            </p>
          </div>
        </div>

        <!-- Category bar -->
        <app-category-filters
          [activeCategory]="activeCategory()"
          (categoryChange)="onCategoryChange($event)"
        />

        <!-- Search + Filters -->
        <app-search-filters
          [query]="searchQuery()"
          [minRating]="minRating()"
          [maxPrice]="maxPrice()"
          [sortBy]="sortBy()"
          (queryChange)="onQueryChange($event)"
          (minRatingChange)="onMinRatingChange($event)"
          (maxPriceChange)="onMaxPriceChange($event)"
          (sortByChange)="onSortChange($event)"
        />

        <!-- Results count -->
        <div class="results-bar">
          <p class="results-count">
            {{ filteredProviders().length }}
            {{ filteredProviders().length === 1 ? 'provider' : 'providers' }} found
          </p>
          @if (hasActiveFilters()) {
            <button type="button" class="clear-btn" (click)="clearFilters()">
              <span class="material-icons-outlined">clear</span>
              Clear filters
            </button>
          }
        </div>

        <!-- Results grid -->
        @if (filteredProviders().length > 0) {
          <div class="providers-grid">
            @for (provider of pagedProviders(); track provider.user._id) {
              <app-provider-card [provider]="provider" />
            }
          </div>

          @if (totalPages() > 1) {
            <div class="pagination-wrap">
              <app-pagination
                [currentPage]="currentPage()"
                [totalPages]="totalPages()"
                (pageChange)="onPageChange($event)"
              />
            </div>
          }
        } @else {
          <app-empty-state
            icon="search_off"
            title="No providers found"
            description="Try adjusting your search filters or browse all categories to find what you're looking for."
            actionLabel="Clear all filters"
            (action)="clearFilters()"
          />
        }
      </div>
    </div>

    <app-footer />
  `,
  styles: [`
    :host { display: block; }

    .container {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: 0 var(--space-4);
    }

    .search-page {
      padding: calc(var(--navbar-height) + var(--space-8)) 0 var(--space-12);
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: var(--space-6);
    }

    .page-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    .page-subtitle {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
    }

    .results-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: var(--space-6) 0 var(--space-4);
    }

    .results-count {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .clear-btn {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      background: none;
      border: none;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--primary-600);
      cursor: pointer;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      transition: background var(--transition-fast);

      &:hover { background: var(--primary-50); }
    }

    :host-context(.dark) .clear-btn { color: var(--primary-400); }
    :host-context(.dark) .clear-btn:hover { background: rgba(79, 70, 229, 0.1); }

    .clear-btn .material-icons-outlined { font-size: 1rem; }

    .providers-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-5);
    }

    @media (min-width: 640px) {
      .providers-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (min-width: 1024px) {
      .providers-grid { grid-template-columns: repeat(3, 1fr); }
    }

    .pagination-wrap {
      display: flex;
      justify-content: center;
      margin-top: var(--space-8);
    }
  `],
})
export class SearchProvidersComponent {
  activeCategory = signal('all');
  searchQuery = signal('');
  minRating = signal(0);
  maxPrice = signal<number | null>(null);
  sortBy = signal('rating');
  currentPage = signal(1);
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
    let result = [...MOCK_PROVIDERS];

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
      case 'reviews':     result.sort((a, b) => b.profile.ratingCount - a.profile.ratingCount); break;
      case 'price_low':   result.sort((a, b) => Math.min(...a.services.map(s => s.price)) - Math.min(...b.services.map(s => s.price))); break;
      case 'price_high':  result.sort((a, b) => Math.max(...b.services.map(s => s.price)) - Math.max(...a.services.map(s => s.price))); break;
    }

    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredProviders().length / this.pageSize));

  pagedProviders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProviders().slice(start, start + this.pageSize);
  });

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
}
