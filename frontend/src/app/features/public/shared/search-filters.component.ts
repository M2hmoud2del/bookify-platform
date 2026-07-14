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
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.css',
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
