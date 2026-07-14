import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
})
export class EmptyStateComponent {
  icon = input<string>();
  title = input<string>();
  description = input<string>();
  actionLabel = input<string>();
  actionVariant = input<'primary' | 'secondary' | 'outline' | 'ghost'>('primary');

  action = output<void>();
}
