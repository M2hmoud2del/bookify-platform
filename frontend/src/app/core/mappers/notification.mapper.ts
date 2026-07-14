import {
  BackendNotification,
  NotificationLinkRole,
  NotificationMetadata,
  NotificationStatus,
  NotificationType,
  NotificationView,
} from '../models/notification.model';

const TYPE_META: Record<string, { label: string; icon: string; iconClass: string }> = {
  payment_success: { label: 'Payment successful', icon: 'payments', iconClass: 'payment' },
  payment_failed: { label: 'Payment failed', icon: 'error', iconClass: 'failed' },
  booking_confirmation: { label: 'Booking confirmed', icon: 'event_available', iconClass: 'confirmed' },
  new_booking_alert: { label: 'New booking', icon: 'event', iconClass: 'booking' },
  appointment_cancelled: { label: 'Appointment cancelled', icon: 'event_busy', iconClass: 'cancelled' },
  refund_issued: { label: 'Refund issued', icon: 'undo', iconClass: 'payment' },
  appointment_reminder: { label: 'Appointment reminder', icon: 'notifications_active', iconClass: 'reminder' },
  review_request: { label: 'Review request', icon: 'rate_review', iconClass: 'review' },
  email_verification: { label: 'Email verification', icon: 'mark_email_read', iconClass: 'default' },
  password_reset: { label: 'Password reset', icon: 'lock_reset', iconClass: 'default' },
};

export function mapBackendNotification(notification: BackendNotification): NotificationView {
  const now = new Date().toISOString();
  const type = notification.type || 'notification';
  const meta = TYPE_META[type] || createTypeMeta(type);
  const metadata = normalizeMetadata(notification.metadata);
  const title = notification.title || notification.subject || meta.label;
  const message = notification.message || stringValue(metadata.text) || notification.subject || meta.label;
  const status = notification.status || 'sent';

  return {
    _id: notification._id || notification.id || '',
    user: notification.user || notification.recipient || '',
    type,
    typeLabel: meta.label,
    title,
    message,
    icon: meta.icon,
    iconClass: meta.iconClass,
    channel: notification.channel || 'email',
    status,
    statusLabel: formatStatus(status),
    readAt: notification.readAt || null,
    metadata,
    createdAt: notification.createdAt || now,
    updatedAt: notification.updatedAt || now,
    isUnread: isUnread(notification),
  };
}

export function mapBackendNotifications(notifications: BackendNotification[] = []): NotificationView[] {
  return notifications.map(mapBackendNotification);
}

export function countUnreadNotifications(notifications: NotificationView[]): number {
  const hasExplicitReadState = notifications.some((notification) =>
    Boolean(notification.readAt) || notification.status === 'read' || notification.status === 'unread'
  );

  if (!hasExplicitReadState) {
    return 0;
  }

  return notifications.filter((notification) => notification.isUnread).length;
}

export function buildNotificationLink(notification: NotificationView, role: NotificationLinkRole): string | null {
  const metadata = notification.metadata;

  if (metadata.appointmentId) {
    return `/${role}/appointments/${metadata.appointmentId}`;
  }

  if (metadata.paymentId) {
    return `/${role}/payments`;
  }

  if (metadata.reviewId && role === 'customer') {
    return '/customer/reviews';
  }

  if (metadata.reviewId && role === 'provider') {
    return '/provider/reviews';
  }

  if (notification.type === 'review_request' && role === 'customer') {
    return '/customer/reviews';
  }

  return null;
}

function normalizeMetadata(metadata?: NotificationMetadata): NotificationMetadata {
  return metadata && typeof metadata === 'object' ? metadata : {};
}

function isUnread(notification: BackendNotification): boolean {
  if (notification.status === 'unread') {
    return true;
  }

  if (notification.status === 'read') {
    return false;
  }

  return notification.readAt === null;
}

function createTypeMeta(type: NotificationType): { label: string; icon: string; iconClass: string } {
  return {
    label: String(type).split('_').map(capitalize).join(' '),
    icon: 'notifications',
    iconClass: 'default',
  };
}

function formatStatus(status: NotificationStatus): string {
  return String(status).split('_').map(capitalize).join(' ');
}

function capitalize(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : '';
}
