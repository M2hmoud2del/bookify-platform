import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [title]="title()"
      [description]="description()"
      [icon]="icon()"
      size="sm"
      [showFooter]="false"
      (close)="cancel.emit()"
    >
      <div class="confirm-body">
        @if (message()) {
          <p class="confirm-message">{{ message() }}</p>
        }

        <div class="confirm-actions">
          <app-button
            variant="ghost"
            [disabled]="loading()"
            (onClick)="cancel.emit()"
          >
            {{ cancelText() }}
          </app-button>

          <app-button
            [variant]="confirmVariant()"
            [loading]="loading()"
            (onClick)="confirm.emit()"
          >
            {{ confirmText() }}
          </app-button>
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    .confirm-body {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .confirm-message {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
    }
  `],
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
