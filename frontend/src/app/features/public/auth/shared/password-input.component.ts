import { Component, input, model, output, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="pw-field" [class.has-error]="error()" [class.is-disabled]="isDisabled">
      @if (label()) {
        <label class="pw-label" [for]="fieldId">
          {{ label() }}
          @if (required()) {
            <span class="required-mark" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="pw-input-wrap" [class.is-focused]="focused()">
        <span class="pw-icon-left material-icons-outlined">lock</span>

        <input
          [id]="fieldId"
          class="pw-input"
          [type]="visible() ? 'text' : 'password'"
          [placeholder]="placeholder()"
          [disabled]="isDisabled"
          [attr.autocomplete]="autocomplete()"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (focus)="focused.set(true)"
          (blur)="focused.set(false); onTouched()"
        />

        <button
          type="button"
          class="pw-toggle"
          [attr.aria-label]="visible() ? 'Hide password' : 'Show password'"
          (click)="toggleVisibility()"
          tabindex="-1"
        >
          <span class="material-icons-outlined">
            {{ visible() ? 'visibility' : 'visibility_off' }}
          </span>
        </button>
      </div>

      @if (error()) {
        <p class="pw-error">
          <span class="material-icons-outlined error-icon">error_outline</span>
          {{ error() }}
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .pw-field { display: flex; flex-direction: column; gap: var(--space-1); }

    .pw-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .required-mark { color: var(--danger-500); margin-left: 2px; }

    .pw-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    :host-context(.dark) .pw-input-wrap {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .pw-input-wrap.is-focused {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    :host-context(.dark) .pw-input-wrap.is-focused {
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    .has-error .pw-input-wrap {
      border-color: var(--danger-500);
    }

    .has-error .pw-input-wrap.is-focused {
      box-shadow: 0 0 0 3px var(--danger-100);
    }

    .pw-icon-left {
      position: absolute;
      left: var(--space-3);
      font-size: 1.125rem;
      color: var(--gray-400);
      pointer-events: none;
      user-select: none;
    }

    .pw-input {
      flex: 1;
      padding: var(--space-3) var(--space-10) var(--space-3) var(--space-9);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: transparent;
      border: none;
      outline: none;
      width: 100%;

      &::placeholder { color: var(--gray-400); }

      &:disabled { cursor: not-allowed; color: var(--gray-400); }
    }

    :host-context(.dark) .pw-input { color: var(--gray-100); }

    .pw-toggle {
      position: absolute;
      right: var(--space-2);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      border-radius: var(--radius-md);
      color: var(--gray-400);
      cursor: pointer;
      transition: color var(--transition-fast), background var(--transition-fast);

      &:hover {
        color: var(--gray-600);
        background: var(--gray-100);
      }
    }

    :host-context(.dark) .pw-toggle:hover {
      color: var(--gray-300);
      background: var(--gray-700);
    }

    .pw-toggle .material-icons-outlined { font-size: 1.125rem; }

    .pw-error {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-xs);
      color: var(--danger-600);
      margin: 0;
    }

    .error-icon { font-size: 0.875rem; }
  `],
})
export class PasswordInputComponent implements ControlValueAccessor {
  label       = input<string>();
  placeholder = input('Enter password');
  required    = input(false);
  error       = input<string>();
  autocomplete = input('current-password');

  value   = model('');
  focused = signal(false);
  visible = signal(false);
  isDisabled = false;

  private static _counter = 0;
  readonly fieldId = `pw-${++PasswordInputComponent._counter}`;

  private _onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  toggleVisibility(): void { this.visible.update(v => !v); }

  onValueChange(val: string): void { this._onChange(val); }

  writeValue(v: string): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled = d; }
}
