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
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
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
