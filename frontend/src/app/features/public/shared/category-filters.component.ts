import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PROVIDER_CATEGORIES } from '../shared/public.models';

@Component({
  selector: 'app-category-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="category-bar">
      <div class="category-scroll">
        @for (cat of categories; track cat.id) {
          <button
            type="button"
            class="category-chip"
            [class.is-active]="activeCategory() === cat.id"
            (click)="selectCategory(cat.id)"
          >
            <span class="material-icons-outlined">{{ cat.icon }}</span>
            <span class="chip-label">{{ cat.label }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .category-bar {
      position: relative;
      width: 100%;
    }

    .category-scroll {
      display: flex;
      gap: var(--space-2);
      overflow-x: auto;
      padding: var(--space-1) 0;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar { display: none; }
    }

    .category-chip {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-4);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--primary-300);
        color: var(--primary-600);
        background: var(--primary-50);
      }

      &.is-active {
        background: var(--primary-500);
        border-color: var(--primary-500);
        color: #fff;
        box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
      }
    }

    :host-context(.dark) .category-chip {
      background: var(--gray-800);
      border-color: var(--gray-700);

      &:hover {
        background: rgba(79, 70, 229, 0.1);
        border-color: var(--primary-500);
        color: var(--primary-400);
      }

      &.is-active {
        background: var(--primary-500);
        border-color: var(--primary-500);
        color: #fff;
      }
    }

    .category-chip .material-icons-outlined {
      font-size: 1.125rem;
    }
  `],
})
export class CategoryFiltersComponent {
  activeCategory = input<string>('all');
  categoryChange = output<string>();

  categories = PROVIDER_CATEGORIES;

  selectCategory(id: string): void {
    this.categoryChange.emit(id);
  }
}
