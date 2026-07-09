import { Component, input, output, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onOverlayClick()" role="none" aria-hidden="true">
        <div
          class="modal-container"
          [ngClass]="{
            'modal-sm': size() === 'sm',
            'modal-lg': size() === 'lg',
            'modal-xl': size() === 'xl'
          }"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title() ? 'modal-title' : null"
          [attr.aria-describedby]="description() ? 'modal-description' : null"
          (click)="$event.stopPropagation()"
        >
          <div class="modal-header">
            @if (icon()) {
              <span class="modal-icon">
                <span class="material-icons-outlined">{{ icon() }}</span>
              </span>
            }
            <div class="modal-header-content">
              @if (title()) {
                <h2 id="modal-title" class="modal-title">{{ title() }}</h2>
              }
              @if (description()) {
                <p id="modal-description" class="modal-description">{{ description() }}</p>
              }
            </div>
            <button
              type="button"
              class="modal-close"
              (click)="close.emit()"
              aria-label="Close modal"
            >
              <span class="material-icons-outlined">close</span>
            </button>
          </div>

          <div class="modal-body">
            <ng-content />
          </div>

          @if (showFooter()) {
            <div class="modal-footer">
              <ng-content select="[modal-footer]" />
              @if (!hasFooterContent) {
                <app-button variant="secondary" (onClick)="close.emit()">
                  {{ cancelText() }}
                </app-button>
                <app-button
                  [variant]="confirmVariant()"
                  [loading]="loading()"
                  (onClick)="confirm.emit()"
                >
                  {{ confirmText() }}
                </app-button>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--z-modal-backdrop);
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-4);
      animation: fadeIn var(--transition-normal);
    }

    :host-context(.dark) .modal-overlay {
      background: rgba(0, 0, 0, 0.7);
    }

    .modal-container {
      position: relative;
      z-index: var(--z-modal);
      width: 100%;
      max-width: 480px;
      max-height: calc(100vh - 2rem);
      background: var(--surface);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-2xl);
      overflow: hidden;
      animation: scaleIn var(--transition-normal);
      display: flex;
      flex-direction: column;
    }

    :host-context(.dark) .modal-container {
      background: var(--gray-800);
    }

    .modal-sm {
      max-width: 360px;
    }

    .modal-lg {
      max-width: 640px;
    }

    .modal-xl {
      max-width: 800px;
    }

    .modal-header {
      padding: var(--space-5) var(--space-6);
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .modal-header {
      border-color: var(--gray-700);
    }

    .modal-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--primary-100);
      color: var(--primary-600);
      flex-shrink: 0;
    }

    :host-context(.dark) .modal-icon {
      background: rgba(79, 70, 229, 0.2);
      color: var(--primary-400);
    }

    .modal-icon .material-icons-outlined {
      font-size: 1.5rem;
    }

    .modal-header-content {
      flex: 1;
      min-width: 0;
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .modal-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0.25rem 0 0;
    }

    .modal-close {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.375rem;
      background: transparent;
      border-radius: var(--radius-md);
      color: var(--gray-400);
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .modal-close:hover {
      background: var(--gray-100);
      color: var(--gray-600);
    }

    :host-context(.dark) .modal-close:hover {
      background: var(--gray-700);
      color: var(--gray-300);
    }

    .modal-close .material-icons-outlined {
      font-size: 1.25rem;
    }

    .modal-body {
      padding: var(--space-6);
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
    }

    :host-context(.dark) .modal-footer {
      border-color: var(--gray-700);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `],
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
