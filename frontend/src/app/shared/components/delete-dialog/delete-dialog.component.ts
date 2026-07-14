import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './delete-dialog.component.html',
})
export class DeleteDialogComponent {
  isOpen      = input(false);
  title       = input('Delete Item');
  description = input('This action cannot be undone.');
  message     = input<string>();
  confirmText = input('Delete');
  loading     = input(false);

  confirm = output<void>();
  cancel  = output<void>();
}
