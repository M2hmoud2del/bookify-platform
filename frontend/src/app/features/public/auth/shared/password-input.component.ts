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
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css',
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
