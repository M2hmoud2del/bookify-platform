import { BackendAppointment, AppointmentView } from './appointment.model';
import { Payment, PaymentStatus, User } from './user.model';
import { BackendUser } from '../mappers/user.mapper';

export type BackendPaymentStatus = PaymentStatus | string;

export interface BackendPayment {
  _id?: string;
  id?: string;
  appointment?: string | BackendAppointment;
  customer?: string | BackendUser;
  provider?: string | BackendUser;
  amount?: number;
  currency?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status?: BackendPaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckoutSessionPayload {
  appointmentId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  sessionId?: string;
  payment?: PaymentView;
}

export interface PaymentView extends Omit<Payment, 'appointment' | 'customer' | 'provider'> {
  appointment: string | AppointmentView;
  customer: string | User;
  provider: string | User;
}
