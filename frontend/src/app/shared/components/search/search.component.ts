import { Component, input, output, signal, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
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
