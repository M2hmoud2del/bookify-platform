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
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
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
