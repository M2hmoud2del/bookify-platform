import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { SelectComponent, SelectOption } from '../../../shared/components/dropdown/dropdown.component';
import { SORT_OPTIONS } from '../shared/public.models';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent, SelectComponent],
  template: `
    <div class="filters-bar">
      <div class="filters-main">
        <app-search
          class="search-field"
          placeholder="Search by name, service, or location..."
          [value]="query()"
          (valueChange)="onQueryChange($event)"
        />

        <div class="filter-controls">
          <div class="control-group">
            <label class="control-label">Min Rating</label>
            <div class="rating-options">
              @for (r of [0, 3, 4, 4.5]; track r) {
                <button
                  type="button"
                  class="rating-pill"
                  [class.is-active]="minRating() === r"
                  (click)="onRatingChange(r)"
                >
                  @if (r === 0) {
                    <span class="material-icons-outlined">star</span> Any
                  } @else {
                    <span class="material-icons-outlined">star</span>
                    {{ r }}+
                  }
                </button>
              }
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">Price Range</label>
            <div class="price-options">
              @for (pr of priceRanges; track pr.value) {
                <button
                  type="button"
                  class="price-pill"
                  [class.is-active]="maxPrice() === pr.value"
                  (click)="onPriceChange(pr.value)"
                >
                  {{ pr.label }}
                </button>
              }
            </div>
          </div>

          <div class="control-group sort-group">
            <label class="control-label">Sort By</label>
            <app-select
              class="sort-select"
              [options]="sortOptions"
              [(ngModel)]="sortValue"
              (ngModelChange)="onSortChange($event)"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .filters-bar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      padding: var(--space-5);
    }

    :host-context(.dark) .filters-bar {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .filters-main {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .search-field { flex: 1; }

    .filter-controls {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 768px) {
      .filter-controls {
        grid-template-columns: auto auto 1fr;
        align-items: end;
      }
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .control-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .rating-options, .price-options {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .rating-pill, .price-pill {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: var(--space-2) var(--space-3);
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--primary-300);
        color: var(--primary-600);
      }

      &.is-active {
        background: var(--primary-500);
        border-color: var(--primary-500);
        color: #fff;
      }
    }

    :host-context(.dark) .rating-pill,
    :host-context(.dark) .price-pill {
      background: var(--gray-700);
      border-color: var(--gray-600);

      &:hover {
        border-color: var(--primary-500);
        color: var(--primary-400);
      }

      &.is-active {
        background: var(--primary-500);
        border-color: var(--primary-500);
        color: #fff;
      }
    }

    .rating-pill .material-icons-outlined {
      font-size: 0.875rem;
      color: var(--warning-500);
    }

    .rating-pill.is-active .material-icons-outlined {
      color: #fff;
    }

    .sort-group {
      min-width: 180px;
    }

    .sort-select {
      width: 100%;
    }
  `],
})
export class SearchFiltersComponent {
  query = input('');
  minRating = input(0);
  maxPrice = input<number | null>(null);
  sortBy = input('rating');

  sortValue: string | number | null = 'rating';

  queryChange = output<string>();
  minRatingChange = output<number>();
  maxPriceChange = output<number | null>();
  sortByChange = output<string>();

  priceRanges = [
    { label: 'Any',   value: null as number | null },
    { label: '$',     value: 50 as number | null },
    { label: '$$',    value: 150 as number | null },
    { label: '$$$',   value: 500 as number | null },
  ];

  sortOptions: SelectOption[] = SORT_OPTIONS.map(o => ({ value: o.value, label: o.label }));

  onQueryChange(val: string): void { this.queryChange.emit(val); }
  onRatingChange(val: number): void { this.minRatingChange.emit(val); }
  onPriceChange(val: number | null): void { this.maxPriceChange.emit(val); }
  onSortChange(val: string | number | null): void {
    if (val !== null) this.sortByChange.emit(String(val));
  }
}
