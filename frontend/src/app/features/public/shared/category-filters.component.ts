import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PROVIDER_CATEGORIES } from '../shared/public.models';

@Component({
  selector: 'app-category-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-filters.component.html',
  styleUrl: './category-filters.component.css',
})
export class CategoryFiltersComponent {
  activeCategory = input<string>('all');
  categoryChange = output<string>();

  categories = PROVIDER_CATEGORIES;

  selectCategory(id: string): void {
    this.categoryChange.emit(id);
  }
}
