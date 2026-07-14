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
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
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
