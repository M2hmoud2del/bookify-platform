import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (totalPages() > 1) {
      <nav class="pagination" role="navigation" aria-label="Pagination">
        <app-button
          variant="ghost"
          size="sm"
          [disabled]="currentPage() === 1"
          (onClick)="onPageChange(currentPage() - 1)"
        >
          <span class="material-icons-outlined">chevron_left</span>
          <span class="sr-only">Previous</span>
        </app-button>

        @for (page of visiblePages(); track page) {
          @if (page === '...') {
            <span class="pagination-ellipsis">...</span>
          } @else {
            <app-button
              [variant]="page === currentPage() ? 'primary' : 'ghost'"
              size="sm"
              (onClick)="handlePageClick(page)"
            >
              {{ page }}
            </app-button>
          }
        }

        <app-button
          variant="ghost"
          size="sm"
          [disabled]="currentPage() === totalPages()"
          (onClick)="onPageChange(currentPage() + 1)"
        >
          <span class="material-icons-outlined">chevron_right</span>
          <span class="sr-only">Next</span>
        </app-button>
      </nav>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
    }

    .pagination-ellipsis {
      padding: 0 var(--space-2);
      color: var(--text-secondary);
    }
  `],
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  maxVisible = input(5);

  pageChange = output<number>();

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const max = this.maxVisible();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const half = Math.floor(max / 2);

    if (current <= half + 1) {
      for (let i = 1; i <= Math.min(max - 1, total - 1); i++) {
        pages.push(i);
      }
      pages.push('...', total);
    } else if (current >= total - half) {
      pages.push(1, '...');
      for (let i = total - max + 2; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, '...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...', total);
    }

    return pages;
  });

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  handlePageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.onPageChange(page);
    }
  }
}
