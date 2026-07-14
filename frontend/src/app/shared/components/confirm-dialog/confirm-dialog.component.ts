import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
  isOpen    = input(false);
  title     = input('Confirm Action');
  description = input<string>();
  message   = input<string>();
  icon      = input<string>();
  confirmText = input('Confirm');
  cancelText  = input('Cancel');
  confirmVariant = input<'primary' | 'danger'>('primary');
  loading   = input(false);

  confirm = output<void>();
  cancel  = output<void>();
}
