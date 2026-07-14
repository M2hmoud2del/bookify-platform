import { mapBackendAppointment } from './appointment.mapper';
import { BackendPayment, CheckoutSessionResult, PaymentView } from '../models/payment.model';
import { BackendAppointment } from '../models/appointment.model';
import { BackendUser, mapBackendUser } from './user.mapper';
import { PaymentStatus, User } from '../models/user.model';

const SUPPORTED_PAYMENT_STATUSES: PaymentStatus[] = ['unpaid', 'pending', 'paid', 'failed', 'refunded'];

export function mapBackendPayment(payment: BackendPayment): PaymentView {
  const now = new Date().toISOString();

  return {
    _id: payment._id || payment.id || '',
    appointment: mapPaymentAppointment(payment.appointment),
    customer: mapPaymentUser(payment.customer, 'customer'),
    provider: mapPaymentUser(payment.provider, 'provider'),
    amount: Number(payment.amount ?? 0),
    currency: (payment.currency || 'usd').toLowerCase(),
    stripeSessionId: payment.stripeSessionId,
    stripePaymentIntentId: payment.stripePaymentIntentId,
    status: normalizePaymentStatus(payment.status),
    createdAt: payment.createdAt || now,
    updatedAt: payment.updatedAt || now,
  };
}

export function mapBackendPayments(payments: BackendPayment[] = []): PaymentView[] {
  return payments.map(mapBackendPayment);
}

export function normalizePaymentStatus(status?: string): PaymentStatus {
  if (status && SUPPORTED_PAYMENT_STATUSES.includes(status as PaymentStatus)) {
    return status as PaymentStatus;
  }

  return 'pending';
}

export function mapCheckoutSessionResult(body: unknown): CheckoutSessionResult {
  const payload = extractPayload(body);
  const checkoutUrl = payload.checkoutUrl || payload.url || '';

  if (!checkoutUrl) {
    throw new Error('Checkout URL was not returned by the server.');
  }

  return {
    checkoutUrl,
    sessionId: payload.sessionId,
    payment: payload.payment ? mapBackendPayment(payload.payment) : undefined,
  };
}

function extractPayload(body: unknown): {
  checkoutUrl?: string;
  url?: string;
  sessionId?: string;
  payment?: BackendPayment;
} {
  const response = body as { data?: unknown; checkoutUrl?: string; url?: string; sessionId?: string; payment?: BackendPayment };
  return (response?.data as typeof response) || response || {};
}

function mapPaymentAppointment(value?: string | BackendAppointment) {
  if (value && typeof value !== 'string') {
    return mapBackendAppointment(value);
  }

  return typeof value === 'string' ? value : '';
}

function mapPaymentUser(value: BackendPayment['customer'] | BackendPayment['provider'], role: User['role']): string | User {
  if (value && typeof value !== 'string') {
    return mapBackendUser({ ...value, role: value.role || role } as BackendUser);
  }

  return typeof value === 'string' ? value : '';
}
