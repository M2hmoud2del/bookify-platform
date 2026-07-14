import { BackendUser, mapBackendUser } from './user.mapper';
import { mapBackendService } from './service.mapper';
import { AppointmentView, BackendAppointment } from '../models/appointment.model';
import { BackendService } from '../models/service.model';
import { AppointmentPaymentStatus, AppointmentStatus, Service, User } from '../models/user.model';

const SUPPORTED_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'pending_payment',
  'confirmed',
  'rejected',
  'cancelled',
  'completed',
];

const SUPPORTED_PAYMENT_STATUSES: AppointmentPaymentStatus[] = ['unpaid', 'paid', 'refunded'];

export function mapBackendAppointment(appointment: BackendAppointment): AppointmentView {
  const now = new Date().toISOString();
  const date = appointment.date || appointment.localDate || now;
  const localDate = appointment.localDate || date.slice(0, 10);
  const service = mapAppointmentService(appointment.service);

  return {
    _id: appointment._id || appointment.id || '',
    customer: mapAppointmentUser(appointment.customer, 'customer'),
    provider: mapAppointmentUser(appointment.provider, 'provider'),
    service,
    date,
    localDate,
    startTime: appointment.startTime || '',
    endTime: appointment.endTime || '',
    status: normalizeAppointmentStatus(appointment.status),
    paymentStatus: normalizeAppointmentPaymentStatus(appointment.paymentStatus),
    totalAmount: Number(appointment.totalAmount ?? service.price ?? 0),
    notes: appointment.notes,
    timezone: appointment.timezone || 'UTC',
    cancellationReason: appointment.cancellationReason,
    cancelledBy: mapRawId(appointment.cancelledBy),
    cancelledAt: appointment.cancelledAt,
    rejectionReason: appointment.rejectionReason,
    rejectedAt: appointment.rejectedAt,
    completedAt: appointment.completedAt,
    reminderSentAt: appointment.reminderSentAt,
    reviewRequestSentAt: appointment.reviewRequestSentAt,
    createdAt: appointment.createdAt || now,
    updatedAt: appointment.updatedAt || now,
  };
}

export function mapBackendAppointments(appointments: BackendAppointment[] = []): AppointmentView[] {
  return appointments.map(mapBackendAppointment);
}

export function normalizeAppointmentStatus(status?: string): AppointmentStatus {
  if (status && SUPPORTED_APPOINTMENT_STATUSES.includes(status as AppointmentStatus)) {
    return status as AppointmentStatus;
  }

  return 'pending_payment';
}

export function normalizeAppointmentPaymentStatus(status?: string): AppointmentPaymentStatus {
  if (status && SUPPORTED_PAYMENT_STATUSES.includes(status as AppointmentPaymentStatus)) {
    return status as AppointmentPaymentStatus;
  }

  return 'unpaid';
}

function mapAppointmentUser(value: BackendAppointment['customer'] | BackendAppointment['provider'], role: User['role']): User {
  if (value && typeof value !== 'string') {
    return mapBackendUser({ ...value, role: value.role || role } as BackendUser);
  }

  const now = new Date().toISOString();
  return {
    _id: typeof value === 'string' ? value : '',
    name: role === 'provider' ? 'Provider' : 'Customer',
    email: '',
    role,
    authProvider: 'local',
    isActive: true,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function mapAppointmentService(value?: string | BackendService): Service {
  if (value && typeof value !== 'string') {
    return mapBackendService(value);
  }

  const now = new Date().toISOString();
  return {
    _id: typeof value === 'string' ? value : '',
    provider: '',
    title: 'Service',
    description: '',
    category: '',
    price: 0,
    durationMinutes: 1,
    images: [],
    isActive: true,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function mapRawId(value?: string | { _id?: string; id?: string }): string | undefined {
  if (!value) {
    return undefined;
  }

  return typeof value === 'string' ? value : value._id || value.id || undefined;
}
