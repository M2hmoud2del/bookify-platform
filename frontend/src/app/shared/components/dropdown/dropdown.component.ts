import { Component, input, output, signal, computed, forwardRef, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="select-wrapper" [ngClass]="{ 'is-disabled': disabled() }">
      @if (label()) {
        <label class="select-label">{{ label() }}</label>
      }
      <div class="select-container" #container>
        <button
          type="button"
          class="select-trigger"
          [disabled]="disabled()"
          (click)="toggle()"
          aria-haspopup="listbox"
          [attr.aria-expanded]="isOpen()"
        >
          <span [class.select-placeholder]="!selectedLabel()">
            {{ selectedLabel() || placeholder() }}
          </span>
          <span class="select-icon">
            <span class="material-icons-outlined">{{ isOpen() ? 'expand_less' : 'expand_more' }}</span>
          </span>
        </button>
        @if (isOpen()) {
          <ul class="select-dropdown" role="listbox">
            @for (option of options(); track option.value) {
              <li
                class="select-option"
                [ngClass]="{ 'is-selected': option.value === value() }"
                (click)="selectOption(option)"
                role="option"
                [attr.aria-selected]="option.value === value()"
              >
                {{ option.label }}
                @if (option.value === value()) {
                  <span class="select-check">
                    <span class="material-icons-outlined">check</span>
                  </span>
                }
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .select-wrapper {
      position: relative;
    }

    .select-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--gray-700);
      margin-bottom: 0.375rem;
    }

    :host-context(.dark) .select-label {
      color: var(--gray-300);
    }

    .select-container {
      position: relative;
    }

    .select-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.625rem 0.875rem;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: var(--surface);
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;
    }

    :host-context(.dark) .select-trigger {
      color: var(--gray-50);
      background: var(--gray-800);
      border-color: var(--gray-600);
    }

    .select-trigger:hover:not(:disabled) {
      border-color: var(--gray-400);
    }

    .select-trigger:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    :host-context(.dark) .select-trigger:focus {
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    .select-trigger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .select-placeholder {
      color: var(--gray-400);
    }

    .select-icon {
      display: flex;
      color: var(--gray-400);
    }

    .select-icon .material-icons-outlined {
      font-size: 1.25rem;
    }

    .select-dropdown {
      position: absolute;
      top: calc(100% + 0.25rem);
      left: 0;
      right: 0;
      z-index: var(--z-dropdown);
      max-height: 240px;
      overflow-y: auto;
      padding: 0.25rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      animation: fadeInDown var(--transition-normal);
      list-style: none;
    }

    :host-context(.dark) .select-dropdown {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .select-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .select-option:hover {
      background: var(--gray-100);
    }

    :host-context(.dark) .select-option:hover {
      background: var(--gray-700);
    }

    .select-option.is-selected {
      background: var(--primary-100);
      color: var(--primary-700);
    }

    :host-context(.dark) .select-option.is-selected {
      background: rgba(79, 70, 229, 0.2);
      color: var(--primary-300);
    }

    .select-check {
      display: flex;
      color: var(--primary-500);
    }

    .select-check .material-icons-outlined {
      font-size: 1rem;
    }

    .is-disabled {
      opacity: 0.5;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class SelectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  label = input<string>();
  options = input<SelectOption[]>([]);
  placeholder = input('Select...');
  disabled = input(false);

  value = signal<string | number | null>(null);
  isOpen = signal(false);

  @ViewChild('container') containerRef!: ElementRef;

  private onChange: (value: string | number | null) => void = () => {};
  private onTouched: () => void = () => {};

  selectedLabel = computed(() => {
    const v = this.value();
    const opt = this.options().find((o) => o.value === v);
    return opt?.label ?? '';
  });

  ngAfterViewInit(): void {
    document.addEventListener('click', this.handleClickOutside);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside);
  }

  private handleClickOutside = (event: Event): void => {
    if (this.containerRef && !this.containerRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  };

  writeValue(value: string | number | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  toggle(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  selectOption(option: SelectOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.isOpen.set(false);
  }
}
