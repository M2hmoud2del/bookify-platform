import { getStripeClient } from "../../integrations/stripe/stripe.client.js";
import {
  sendBookingConfirmation,
  sendNewBookingAlert,
  sendPaymentFailedNotification,
  sendPaymentSuccessNotification,
  sendRefundIssuedNotification
} from "../notification/index.js";
import { createPaymentError } from "./payment.errors.js";
import {
  confirmAppointmentPayment,
  findAppointmentForCheckout,
  findPaymentByStripePaymentIntentId,
  findPaymentByStripeSessionId,
  findPaymentsForUser,
  markAppointmentPaymentRefunded,
  updatePayment,
  upsertPendingPayment
} from "./payment.repository.js";

const DEFAULT_CURRENCY = "egp";

const defaultRepository = {
  confirmAppointmentPayment,
  findAppointmentForCheckout,
  findPaymentByStripePaymentIntentId,
  findPaymentByStripeSessionId,
  findPaymentsForUser,
  markAppointmentPaymentRefunded,
  updatePayment,
  upsertPendingPayment
};

const defaultNotifications = {
  sendBookingConfirmation,
  sendNewBookingAlert,
  sendPaymentFailedNotification,
  sendPaymentSuccessNotification,
  sendRefundIssuedNotification
};

const getRepository = (dependencies = {}) => dependencies.repository || defaultRepository;
const getNotifications = (dependencies = {}) => dependencies.notifications || defaultNotifications;
const getLogger = (dependencies = {}) => dependencies.logger || console;

const runNotificationTask = async (flow, task, dependencies = {}) => {
  try {
    await task();
  } catch (error) {
    getLogger(dependencies).warn?.("Bookify notification failed", {
      flow,
      message: error.message
    });
  }
};

const buildDefaultUrl = (path) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:4200";
  return `${clientUrl}${path}`;
};

const toStripeAmount = (amount) => Math.round(Number(amount) * 100);

const getRawId = (value) => String(value?._id || value);

const assertCustomerOwnsAppointment = (appointment, customerId) => {
  if (getRawId(appointment.customer) !== String(customerId)) {
    throw createPaymentError("Forbidden: You do not have permission", 403);
  }
};

const assertAppointmentCanBePaid = (appointment) => {
  if (appointment.status !== "pending_payment") {
    throw createPaymentError(`Cannot pay ${appointment.status} appointment`, 400);
  }

  if (appointment.paymentStatus === "paid") {
    throw createPaymentError("Appointment is already paid", 400);
  }
};

const buildCheckoutSessionPayload = ({ appointment, payment, successUrl, cancelUrl }) => {
  const currency = (process.env.STRIPE_CURRENCY || DEFAULT_CURRENCY).toLowerCase();
  const service = appointment.service;
  const amount = toStripeAmount(service.price);

  if (!Number.isInteger(amount) || amount < 1) {
    throw createPaymentError("Service price must be greater than 0 to create a checkout session", 400);
  }

  return {
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: appointment.customer.email,
    success_url: successUrl || buildDefaultUrl("/payments/success?session_id={CHECKOUT_SESSION_ID}"),
    cancel_url: cancelUrl || buildDefaultUrl("/payments/cancel"),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: amount,
          product_data: {
            name: service.title,
            description: service.description || `${service.durationMinutes} minute service`
          }
        }
      }
    ],
    metadata: {
      appointmentId: String(appointment._id),
      paymentId: String(payment._id),
      customerId: getRawId(appointment.customer),
      providerId: getRawId(appointment.provider),
      serviceId: getRawId(service)
    }
  };
};

export const createCheckoutSession = async (customerId, payload, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const appointment = await repository.findAppointmentForCheckout(payload.appointmentId);

  if (!appointment) {
    throw createPaymentError("Appointment not found", 404);
  }

  if (!appointment.service) {
    throw createPaymentError("Appointment service not found", 404);
  }

  assertCustomerOwnsAppointment(appointment, customerId);
  assertAppointmentCanBePaid(appointment);

  const payment = await repository.upsertPendingPayment({
    appointment: appointment._id,
    customer: getRawId(appointment.customer),
    provider: getRawId(appointment.provider),
    amount: appointment.service.price,
    currency: (process.env.STRIPE_CURRENCY || DEFAULT_CURRENCY).toLowerCase(),
    status: "pending"
  });

  const stripe = dependencies.stripe || getStripeClient();
  const session = await stripe.checkout.sessions.create(
    buildCheckoutSessionPayload({
      appointment,
      payment,
      successUrl: payload.successUrl,
      cancelUrl: payload.cancelUrl
    })
  );

  const updatedPayment = await repository.updatePayment(payment._id, {
    stripeSessionId: session.id,
    status: "pending"
  });

  return {
    success: true,
    message: "Checkout session created successfully",
    data: {
      checkoutUrl: session.url,
      sessionId: session.id,
      payment: updatedPayment
    }
  };
};

export const getMyPayments = async (user, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const payments = await repository.findPaymentsForUser(user);

  return {
    success: true,
    message: "Payments retrieved successfully",
    data: { payments }
  };
};

const getPaymentFromSession = async (session, repository) => {
  return repository.findPaymentByStripeSessionId(session.id);
};

const notifyPaymentSuccess = async (appointmentId, dependencies = {}) => {
  const notifications = getNotifications(dependencies);

  await runNotificationTask(
    "payment_success",
    () => notifications.sendPaymentSuccessNotification(appointmentId),
    dependencies
  );
  await runNotificationTask(
    "booking_confirmation",
    () => notifications.sendBookingConfirmation(appointmentId),
    dependencies
  );
  await runNotificationTask(
    "new_booking_alert",
    () => notifications.sendNewBookingAlert(appointmentId),
    dependencies
  );
};

const notifyPaymentFailed = async (appointmentId, dependencies = {}) => {
  const notifications = getNotifications(dependencies);

  await runNotificationTask(
    "payment_failed",
    () => notifications.sendPaymentFailedNotification(appointmentId),
    dependencies
  );
};

const notifyRefundIssued = async (paymentId, dependencies = {}) => {
  const notifications = getNotifications(dependencies);

  await runNotificationTask(
    "refund_issued",
    () => notifications.sendRefundIssuedNotification(paymentId),
    dependencies
  );
};

const markCheckoutSessionPaid = async (session, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const payment = await getPaymentFromSession(session, repository);

  if (!payment) {
    return null;
  }

  const updatedPayment = await repository.updatePayment(payment._id, {
    stripePaymentIntentId: session.payment_intent,
    status: "paid"
  });

  const appointment = await repository.confirmAppointmentPayment(payment.appointment);
  const appointmentId = appointment?._id || payment.appointment;

  await notifyPaymentSuccess(appointmentId, dependencies);

  return { payment: updatedPayment, appointment };
};

const markCheckoutSessionFailed = async (session, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const payment = await getPaymentFromSession(session, repository);

  if (!payment) {
    return null;
  }

  const updatedPayment = await repository.updatePayment(payment._id, {
    stripePaymentIntentId: session.payment_intent || payment.stripePaymentIntentId,
    status: "failed"
  });

  await notifyPaymentFailed(payment.appointment, dependencies);

  return { payment: updatedPayment };
};

const markPaymentIntentFailed = async (paymentIntent, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const payment = await repository.findPaymentByStripePaymentIntentId(paymentIntent.id);

  if (!payment) {
    return null;
  }

  const updatedPayment = await repository.updatePayment(payment._id, {
    status: "failed"
  });

  await notifyPaymentFailed(payment.appointment, dependencies);

  return { payment: updatedPayment };
};

const markChargeRefunded = async (charge, dependencies = {}) => {
  if (!charge.payment_intent) {
    return null;
  }

  const repository = getRepository(dependencies);
  const payment = await repository.findPaymentByStripePaymentIntentId(charge.payment_intent);

  if (!payment) {
    return null;
  }

  const updatedPayment = await repository.updatePayment(payment._id, {
    status: "refunded"
  });

  const appointment = await repository.markAppointmentPaymentRefunded(payment.appointment);

  await notifyRefundIssued(updatedPayment?._id || payment._id, dependencies);

  return { payment: updatedPayment, appointment };
};

export const handleStripeWebhook = async ({ body, signature }, dependencies = {}) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw createPaymentError("STRIPE_WEBHOOK_SECRET is not configured", 500);
  }

  const stripe = dependencies.stripe || getStripeClient();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw createPaymentError(`Webhook signature verification failed: ${error.message}`, 400);
  }

  let result = null;

  if (event.type === "checkout.session.completed") {
    result = await markCheckoutSessionPaid(event.data.object, dependencies);
  }

  if (
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "checkout.session.expired"
  ) {
    result = await markCheckoutSessionFailed(event.data.object, dependencies);
  }

  if (event.type === "payment_intent.payment_failed") {
    result = await markPaymentIntentFailed(event.data.object, dependencies);
  }

  if (event.type === "charge.refunded") {
    result = await markChargeRefunded(event.data.object, dependencies);
  }

  return {
    success: true,
    received: true,
    eventType: event.type,
    data: result
  };
};
