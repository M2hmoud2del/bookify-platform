import { Component, input, output, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container" [ngClass]="{ 'search-focused': isFocused() }">
      <span class="search-icon">
        <span class="material-icons-outlined">search</span>
      </span>
      <input
        type="text"
        class="search-input"
        [placeholder]="placeholder()"
        [(ngModel)]="value"
        (focus)="isFocused.set(true)"
        (blur)="isFocused.set(false)"
        (input)="onInput()"
      />
      @if (value()) {
        <button type="button" class="search-clear" (click)="onClear()">
          <span class="material-icons-outlined">close</span>
        </button>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .search-container {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: 0 var(--space-3);
      background: var(--gray-100);
      border: 1px solid transparent;
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .search-container {
      background: var(--gray-800);
    }

    .search-container:hover {
      background: var(--gray-50);
    }

    .search-focused {
      background: var(--surface);
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    :host-context(.dark) .search-focused {
      background: var(--gray-900);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    :host-context(.dark) .search-focused:hover {
      background: var(--gray-900);
    }

    .search-icon {
      display: flex;
      color: var(--gray-400);
    }

    .search-icon .material-icons-outlined {
      font-size: 1.25rem;
    }

    .search-input {
      flex: 1;
      padding: var(--space-2) 0;
      font-size: var(--font-size-sm);
      background: transparent;
      border: none;
      color: var(--text-primary);
      outline: none;
    }

    .search-input::placeholder {
      color: var(--gray-400);
    }

    .search-clear {
      display: flex;
      padding: 0.25rem;
      background: transparent;
      border-radius: var(--radius-md);
      color: var(--gray-400);
      cursor: pointer;
      transition: all var(--transition-fast);
      margin: 0 -0.25rem;
    }

    .search-clear:hover {
      background: var(--gray-200);
      color: var(--gray-600);
    }

    :host-context(.dark) .search-clear:hover {
      background: var(--gray-700);
      color: var(--gray-300);
    }

    .search-clear .material-icons-outlined {
      font-size: 1rem;
    }
  `],
})
export class SearchComponent {
  placeholder = input('Search...');
  value = model<string>('');
  valueChange = output<string>();

  isFocused = signal(false);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.valueChange.emit(this.value());
    }, 300);
  }

  onClear(): void {
    this.value.set('');
    this.valueChange.emit('');
  }
}
