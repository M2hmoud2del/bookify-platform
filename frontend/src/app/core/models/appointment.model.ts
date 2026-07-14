import { BackendUser } from '../mappers/user.mapper';
import { BackendService } from './service.model';
import { Appointment, AppointmentPaymentStatus, AppointmentStatus, Service, User } from './user.model';

export type BackendAppointmentStatus = AppointmentStatus | 'pending' | 'in_progress' | 'no_show' | string;
export type BackendAppointmentPaymentStatus = AppointmentPaymentStatus | 'pending' | 'failed' | string;

export interface BackendAppointment {
  _id?: string;
  id?: string;
  customer?: string | BackendUser;
  provider?: string | BackendUser;
  service?: string | BackendService;
  date?: string;
  localDate?: string;
  startTime?: string;
  endTime?: string;
  status?: BackendAppointmentStatus;
  paymentStatus?: BackendAppointmentPaymentStatus;
  totalAmount?: number;
  notes?: string;
  timezone?: string;
  cancellationReason?: string;
  cancelledBy?: string | BackendUser;
  cancelledAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  completedAt?: string;
  reminderSentAt?: string;
  reviewRequestSentAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentPayload {
  providerId: string;
  serviceId: string;
  date: string;
  startTime: string;
  notes?: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  date?: string;
  from?: string;
  to?: string;
}

export interface AppointmentView extends Omit<Appointment, 'customer' | 'provider' | 'service'> {
  customer: User;
  provider: User;
  service: Service;
  totalAmount: number;
}
