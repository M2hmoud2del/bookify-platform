import { Component, input, output, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      class="btn"
      [ngClass]="{
        'btn-primary': variant() === 'primary',
        'btn-secondary': variant() === 'secondary',
        'btn-outline': variant() === 'outline',
        'btn-ghost': variant() === 'ghost',
        'btn-danger': variant() === 'danger',
        'btn-sm': size() === 'sm',
        'btn-lg': size() === 'lg',
        'btn-loading': loading(),
        'btn-full': fullWidth()
      }"
      (click)="onClick.emit($event)"
    >
      @if (loading()) {
        <span class="btn-spinner"></span>
      }
      <span class="btn-content" [class.opacity-0]="loading()">
        <ng-content />
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      font-family: var(--font-family);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      line-height: 1.25rem;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      position: relative;
      white-space: nowrap;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--primary-500);
      color: white;
      border: 1px solid transparent;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-600);
    }

    .btn-secondary {
      background: var(--gray-100);
      color: var(--gray-900);
      border: 1px solid transparent;
    }

    :host-context(.dark) .btn-secondary {
      background: var(--gray-700);
      color: var(--gray-50);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--gray-200);
    }

    :host-context(.dark) .btn-secondary:hover:not(:disabled) {
      background: var(--gray-600);
    }

    .btn-outline {
      background: transparent;
      color: var(--gray-700);
      border: 1px solid var(--gray-300);
    }

    :host-context(.dark) .btn-outline {
      color: var(--gray-200);
      border-color: var(--gray-600);
    }

    .btn-outline:hover:not(:disabled) {
      background: var(--gray-50);
      border-color: var(--gray-400);
    }

    :host-context(.dark) .btn-outline:hover:not(:disabled) {
      background: var(--gray-800);
      border-color: var(--gray-500);
    }

    .btn-ghost {
      background: transparent;
      color: var(--gray-700);
      border: 1px solid transparent;
    }

    :host-context(.dark) .btn-ghost {
      color: var(--gray-200);
    }

    .btn-ghost:hover:not(:disabled) {
      background: var(--gray-100);
    }

    :host-context(.dark) .btn-ghost:hover:not(:disabled) {
      background: var(--gray-800);
    }

    .btn-danger {
      background: var(--danger-500);
      color: white;
      border: 1px solid transparent;
    }

    .btn-danger:hover:not(:disabled) {
      background: var(--danger-600);
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: var(--font-size-xs);
    }

    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: var(--font-size-base);
    }

    .btn-full {
      width: 100%;
    }

    .btn-spinner {
      position: absolute;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .opacity-0 {
      opacity: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  loading = input(false);
  fullWidth = input(false);

  onClick = output<MouseEvent>();
}
