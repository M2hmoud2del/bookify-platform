import { Component, input, output, signal, computed, Injectable, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(toast: Omit<Toast, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id };
    this.toasts.update((toasts) => [...toasts, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, toast.duration ?? 5000);
    }
  }

  success(title: string, message?: string): void {
    this.show({ type: 'success', title, message });
  }

  error(title: string, message?: string): void {
    this.show({ type: 'error', title, message });
  }

  warning(title: string, message?: string): void {
    this.show({ type: 'warning', title, message });
  }

  info(title: string, message?: string): void {
    this.show({ type: 'info', title, message });
  }

  dismiss(id: string): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="toast"
      [ngClass]="{
        'toast-success': toast().type === 'success',
        'toast-error': toast().type === 'error',
        'toast-warning': toast().type === 'warning',
        'toast-info': toast().type === 'info'
      }"
    >
      <span class="toast-icon">
        <span class="material-icons-outlined">{{ icon() }}</span>
      </span>
      <div class="toast-content">
        <p class="toast-title">{{ toast().title }}</p>
        @if (toast().message) {
          <p class="toast-message">{{ toast().message }}</p>
        }
      </div>
      <button type="button" class="toast-close" (click)="dismiss.emit()">
        <span class="material-icons-outlined">close</span>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      min-width: 300px;
      max-width: 420px;
      animation: slideInRight var(--transition-normal);
    }

    :host-context(.dark) .toast {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: var(--radius-full);
      flex-shrink: 0;
    }

    .toast-icon .material-icons-outlined {
      font-size: 1.25rem;
    }

    .toast-success .toast-icon {
      color: var(--success-500);
    }

    .toast-error .toast-icon {
      color: var(--danger-500);
    }

    .toast-warning .toast-icon {
      color: var(--warning-500);
    }

    .toast-info .toast-icon {
      color: var(--primary-500);
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .toast-message {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0.25rem 0 0;
    }

    .toast-close {
      padding: 0.25rem;
      background: transparent;
      border-radius: var(--radius-md);
      color: var(--gray-400);
      cursor: pointer;
      transition: all var(--transition-fast);
      margin: -0.25rem;
    }

    .toast-close:hover {
      background: var(--gray-100);
      color: var(--gray-600);
    }

    :host-context(.dark) .toast-close:hover {
      background: var(--gray-700);
      color: var(--gray-300);
    }

    .toast-close .material-icons-outlined {
      font-size: 1rem;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `],
})
export class ToastComponent {
  toast = input.required<Toast>();
  dismiss = output<void>();

  icon = computed(() => {
    switch (this.toast().type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  });
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <app-toast [toast]="toast" (dismiss)="toastService.dismiss(toast.id)" />
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: var(--space-4);
      right: var(--space-4);
      z-index: var(--z-toast);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
  `],
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
