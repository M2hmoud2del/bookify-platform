import { Component, input, output, model, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="input-wrapper" [ngClass]="{ 'has-error': showErrors(), 'is-disabled': isDisabled() }">
      @if (label()) {
        <label class="input-label" [for]="inputId()">
          {{ label() }}
          @if (required()) {
            <span class="text-danger">*</span>
          }
        </label>
      }

      <div class="input-container">
        @if (iconStart()) {
          <span class="input-icon input-icon-start">
            <span class="material-icons-outlined">{{ iconStart() }}</span>
          </span>
        }

        <input
          [id]="inputId()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          class="input-field"
          [ngClass]="{
            'has-icon-start': iconStart(),
            'has-icon-end': iconEnd()
          }"
        />

        @if (iconEnd()) {
          <span class="input-icon input-icon-end">
            <span class="material-icons-outlined">{{ iconEnd() }}</span>
          </span>
        }
      </div>

      @if (hint()) {
        <p class="input-hint">{{ hint() }}</p>
      }

      @if (showErrors()) {
        <p class="input-error">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .input-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--gray-700);
    }

    :host-context(.dark) .input-label {
      color: var(--gray-300);
    }

    .text-danger {
      color: var(--danger-500);
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-field {
      width: 100%;
      padding: 0.625rem 0.875rem;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-normal);
      line-height: 1.5rem;
      color: var(--gray-900);
      background: var(--surface);
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .input-field {
      color: var(--gray-50);
      background: var(--gray-800);
      border-color: var(--gray-600);
    }

    .input-field::placeholder {
      color: var(--gray-400);
    }

    .input-field:hover:not(:disabled) {
      border-color: var(--gray-400);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    :host-context(.dark) .input-field:focus {
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    .input-field:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--gray-100);
    }

    :host-context(.dark) .input-field:disabled {
      background: var(--gray-900);
    }

    .input-field.has-icon-start {
      padding-left: 2.5rem;
    }

    .input-field.has-icon-end {
      padding-right: 2.5rem;
    }

    .input-icon {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gray-400);
      pointer-events: none;
    }

    .input-icon-start {
      left: 0.75rem;
    }

    .input-icon-end {
      right: 0.75rem;
    }

    .input-icon .material-icons-outlined {
      font-size: 1.25rem;
    }

    .input-hint {
      font-size: var(--font-size-xs);
      color: var(--gray-500);
    }

    .input-error {
      font-size: var(--font-size-xs);
      color: var(--danger-500);
    }

    .has-error .input-field {
      border-color: var(--danger-500);
    }

    .has-error .input-field:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    }

    .is-disabled {
      opacity: 0.5;
    }
  `],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>();
  placeholder = input<string>();
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  placeholderText = input<string>();
  disabledInput = input(false);
  required = input(false);
  iconStart = input<string>();
  iconEnd = input<string>();
  hint = input<string>();
  error = input<string>();

  value = model<string>('');
  focused = signal(false);
  disabledState = signal(false);

  isDisabled = computed(() => this.disabledInput() || this.disabledState());

  inputId = computed(() => `input-${Math.random().toString(36).substring(2, 9)}`);
  showErrors = computed(() => !this.focused() && this.error());

  errorMessage = computed(() => {
    const err = this.error();
    if (!err) return '';
    return err;
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  onFocus(): void {
    this.focused.set(true);
  }
}
