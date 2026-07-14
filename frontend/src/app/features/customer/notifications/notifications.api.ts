import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { countUnreadNotifications, mapBackendNotifications } from '../../../core/mappers/notification.mapper';
import { BackendNotification, NotificationView } from '../../../core/models/notification.model';

interface NotificationResponseBody {
  data?: unknown;
  notifications?: BackendNotification[];
}

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  private api = inject(ApiService);

  async getMyNotifications(): Promise<NotificationView[]> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.notifications.my));
    return mapBackendNotifications(this.extractNotifications(response));
  }

  async getUnreadCount(): Promise<number> {
    const notifications = await this.getMyNotifications();
    return countUnreadNotifications(notifications);
  }

  private extractNotifications(response: unknown): BackendNotification[] {
    const body = this.payload(response);
    const notifications = body.notifications || body;
    return Array.isArray(notifications) ? notifications as BackendNotification[] : [];
  }

  private payload(response: unknown): NotificationResponseBody {
    const body = response as NotificationResponseBody;
    return (body?.data as NotificationResponseBody) || body;
  }
}
