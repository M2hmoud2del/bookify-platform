import { Component, input, output, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true,
    },
  ],
  template: `
    <div class="rating" [ngClass]="{ 'rating-readonly': readonly() }">
      @if (label()) {
        <label class="rating-label">{{ label() }}</label>
      }
      <div class="rating-stars">
        @for (star of [1, 2, 3, 4, 5]; track star) {
          <button
            type="button"
            class="rating-star"
            [ngClass]="{ 'is-filled': star <= displayValue() }"
            (click)="onStarClick(star)"
            (mouseenter)="onStarHover(star)"
            (mouseleave)="onStarLeave()"
            [disabled]="readonly()"
          >
            <span class="material-icons-outlined">
              {{ star <= displayValue() ? 'star' : 'star_border' }}
            </span>
          </button>
        }
        @if (showValue()) {
          <span class="rating-value">{{ value() }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .rating {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .rating-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--gray-700);
    }

    :host-context(.dark) .rating-label {
      color: var(--gray-300);
    }

    .rating-stars {
      display: flex;
      align-items: center;
      gap: 0.125rem;
    }

    .rating-star {
      padding: 0.125rem;
      background: transparent;
      color: var(--gray-300);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .rating-star {
      color: var(--gray-600);
    }

    .rating-star:hover:not(:disabled) {
      transform: scale(1.1);
    }

    .rating-star.is-filled {
      color: var(--warning500, #f59e0b);
    }

    .rating-readonly .rating-star {
      cursor: default;
    }

    .rating-readonly .rating-star:hover {
      transform: none;
    }

    .rating-star .material-icons-outlined {
      font-size: 1.5rem;
    }

    .rating-value {
      margin-left: var(--space-2);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }
  `],
})
export class RatingComponent implements ControlValueAccessor {
  label = input<string>();
  readonly = input(false);
  showValue = input(true);
  value = input(0);

  internalValue = signal(0);
  hoverValue = signal(0);

  displayValue = computed(() => this.hoverValue() || this.internalValue() || this.value());

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  valueChange = output<number>();

  writeValue(value: number): void {
    this.internalValue.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onStarClick(star: number): void {
    if (!this.readonly()) {
      this.internalValue.set(star);
      this.onChange(star);
      this.onTouched();
      this.valueChange.emit(star);
    }
  }

  onStarHover(star: number): void {
    if (!this.readonly()) {
      this.hoverValue.set(star);
    }
  }

  onStarLeave(): void {
    this.hoverValue.set(0);
  }
}
