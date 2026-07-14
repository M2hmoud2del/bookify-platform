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
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
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
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
