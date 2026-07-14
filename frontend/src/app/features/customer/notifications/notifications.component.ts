import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { buildNotificationLink } from '../../../core/mappers/notification.mapper';
import { NotificationView } from '../../../core/models/notification.model';
import { NotificationsApi } from './notifications.api';

@Component({
  selector: 'app-customer-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, EmptyStateComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class CustomerNotificationsComponent {
  private notificationsApi = inject(NotificationsApi);

  notifications = signal<NotificationView[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    void this.loadNotifications();
  }

  async loadNotifications(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.notifications.set(await this.notificationsApi.getMyNotifications());
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load notifications.'));
      this.notifications.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  notificationLink(notification: NotificationView): string | null {
    return buildNotificationLink(notification, 'customer');
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
