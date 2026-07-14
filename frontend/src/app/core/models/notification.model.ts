import { UserRole } from './user.model';

export type NotificationType =
  | 'payment_success'
  | 'payment_failed'
  | 'booking_confirmation'
  | 'new_booking_alert'
  | 'appointment_cancelled'
  | 'refund_issued'
  | 'appointment_reminder'
  | 'review_request'
  | 'email_verification'
  | 'password_reset'
  | string;

export type NotificationChannel = 'email' | 'sms' | 'in_app' | string;
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'read' | 'unread' | string;

export interface NotificationMetadata {
  appointmentId?: string;
  paymentId?: string;
  reviewId?: string;
  text?: string;
  html?: string;
  [key: string]: unknown;
}

export interface BackendNotification {
  _id?: string;
  id?: string;
  user?: string;
  recipient?: string;
  type?: NotificationType;
  title?: string;
  subject?: string;
  message?: string;
  channel?: NotificationChannel;
  status?: NotificationStatus;
  readAt?: string | null;
  metadata?: NotificationMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationView {
  _id: string;
  user: string;
  type: NotificationType;
  typeLabel: string;
  title: string;
  message: string;
  icon: string;
  iconClass: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  statusLabel: string;
  readAt: string | null;
  metadata: NotificationMetadata;
  createdAt: string;
  updatedAt: string;
  isUnread: boolean;
}

export type NotificationLinkRole = Extract<UserRole, 'customer' | 'provider'>;
