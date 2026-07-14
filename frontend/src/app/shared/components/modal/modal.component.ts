import { Component, input, output, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  isOpen = input(true);
  title = input<string>();
  description = input<string>();
  icon = input<string>();
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  showFooter = input(true);
  loading = input(false);
  confirmText = input('Confirm');
  cancelText = input('Cancel');
  confirmVariant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>('primary');

  close = output<void>();
  confirm = output<void>();

  hasFooterContent = false;

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close.emit();
    }
  }

  onOverlayClick(): void {
    this.close.emit();
  }
}
