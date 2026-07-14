import { Component, input, model, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
})
export class TextareaComponent implements ControlValueAccessor {
  label = input<string>();
  placeholder = input<string>();
  hint = input<string>();
  error = input<string>();
  required = input(false);
  rows = input(4);
  maxLength = input<number>();

  value = model<string>('');

  isDisabled = false;

  private _onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  private static _idCounter = 0;
  readonly textareaId = `textarea-${++TextareaComponent._idCounter}`;

  isNearLimit(): boolean {
    const max = this.maxLength();
    if (!max) return false;
    return this.value().length >= max * 0.9;
  }

  onValueChange(val: string): void {
    this._onChange(val);
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
