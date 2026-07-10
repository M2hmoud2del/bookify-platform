import { sendMail } from "../../integrations/mail/index.js";
import { renderTemplate } from "./templates/index.js";
import {
  createNotification as createNotificationRecord,
  findAppointmentById,
  findNotificationById,
  findPaymentById,
  findRetryableFailedNotifications,
  findUserNotifications,
  markNotificationFailed,
  markNotificationSent
} from "./notification.repository.js";

const retryDelayMinutes = 10;

const getId = (value) => String(value?._id || value);

const getRepository = (dependencies = {}) =>
  dependencies.repository || {
    createNotification: createNotificationRecord,
    findAppointmentById,
    findNotificationById,
    findPaymentById,
    findRetryableFailedNotifications,
    findUserNotifications,
    markNotificationFailed,
    markNotificationSent
  };

const getMailer = (dependencies = {}) => dependencies.mailer || { sendMail };

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const nextRetryDate = (now = new Date()) =>
  new Date(now.getTime() + retryDelayMinutes * 60 * 1000);

const appointmentTemplateData = (appointment) => ({
  customerName: appointment.customer?.name || "Customer",
  providerName: appointment.provider?.name || "Provider",
  serviceTitle: appointment.service?.title || "service",
  localDate: appointment.localDate,
  startTime: appointment.startTime,
  endTime: appointment.endTime
});

export const createNotification = async (data, dependencies = {}) => {
  const repository = getRepository(dependencies);
  return repository.createNotification(data);
};

export const sendNotification = async (notificationId, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const mailer = getMailer(dependencies);
  const now = dependencies.now || new Date();
  const notification = await repository.findNotificationById(notificationId);

  if (!notification) {
    throw createError("Notification not found", 404);
  }

  if (notification.attempts >= notification.maxAttempts) {
    return notification;
  }

  try {
    const result = await mailer.sendMail({
      to: notification.toEmail,
      subject: notification.subject,
      html: notification.metadata?.html,
      text: notification.metadata?.text
    });

    return repository.markNotificationSent(notification._id, {
      sentAt: now,
      metadata: {
        ...notification.metadata,
        messageId: result.messageId
      }
    });
  } catch (error) {
    return repository.markNotificationFailed(
      notification._id,
      error.message,
      notification.attempts + 1 >= notification.maxAttempts ? undefined : nextRetryDate(now)
    );
  }
};

export const sendEmailNotification = async (payload, dependencies = {}) => {
  const notification = await createNotification(
    {
      recipient: payload.recipient,
      appointment: payload.appointment,
      type: payload.type,
      toEmail: payload.toEmail,
      subject: payload.subject,
      metadata: {
        ...(payload.metadata || {}),
        html: payload.html,
        text: payload.text
      }
    },
    dependencies
  );

  return sendNotification(notification._id, dependencies);
};

const sendAppointmentEmail = async ({ appointmentId, recipient, type, subject, template, data }, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const appointment = await repository.findAppointmentById(appointmentId);

  if (!appointment) {
    throw createError("Appointment not found", 404);
  }

  const user = appointment[recipient];

  if (!user?.email) {
    throw createError("Recipient email not found", 400);
  }

  const html = renderTemplate(template, {
    ...appointmentTemplateData(appointment),
    ...(data || {})
  });

  return sendEmailNotification(
    {
      recipient: getId(user),
      appointment: appointmentId,
      type,
      toEmail: user.email,
      subject,
      html,
      text: subject,
      metadata: { appointmentId }
    },
    dependencies
  );
};

export const sendBookingConfirmation = (appointmentId, dependencies = {}) =>
  sendAppointmentEmail(
    {
      appointmentId,
      recipient: "customer",
      type: "booking_confirmation",
      subject: "Your Bookify appointment is pending payment",
      template: "booking-confirmation"
    },
    dependencies
  );

export const sendNewBookingAlert = (appointmentId, dependencies = {}) =>
  sendAppointmentEmail(
    {
      appointmentId,
      recipient: "provider",
      type: "new_booking_alert",
      subject: "New Bookify booking request",
      template: "new-booking-alert"
    },
    dependencies
  );

export const sendAppointmentReminder = (appointmentId, dependencies = {}) =>
  sendAppointmentEmail(
    {
      appointmentId,
      recipient: "customer",
      type: "appointment_reminder",
      subject: "Bookify appointment reminder",
      template: "reminder"
    },
    dependencies
  );

export const sendCancellationNotification = (appointmentId, cancelledBy, dependencies = {}) =>
  sendAppointmentEmail(
    {
      appointmentId,
      recipient: "customer",
      type: "appointment_cancelled",
      subject: "Bookify appointment cancelled",
      template: "cancellation",
      data: { cancelledBy }
    },
    dependencies
  );

export const sendReviewRequest = (appointmentId, dependencies = {}) =>
  sendAppointmentEmail(
    {
      appointmentId,
      recipient: "customer",
      type: "review_request",
      subject: "Share your Bookify experience",
      template: "review-request"
    },
    dependencies
  );

export const sendPaymentFailedNotification = (appointmentId, dependencies = {}) =>
  sendAppointmentEmail(
    {
      appointmentId,
      recipient: "customer",
      type: "payment_failed",
      subject: "Bookify payment failed",
      template: "payment-failed"
    },
    dependencies
  );

export const sendRefundIssuedNotification = async (paymentId, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const payment = await repository.findPaymentById(paymentId);

  if (!payment?.customer?.email) {
    throw createError("Payment or customer email not found", 404);
  }

  const html = renderTemplate("refund-issued", {
    customerName: payment.customer.name || "Customer"
  });

  return sendEmailNotification(
    {
      recipient: getId(payment.customer),
      appointment: payment.appointment?._id || payment.appointment,
      type: "refund_issued",
      toEmail: payment.customer.email,
      subject: "Bookify refund issued",
      html,
      text: "Bookify refund issued",
      metadata: { paymentId }
    },
    dependencies
  );
};

export const retryFailedNotifications = async (dependencies = {}) => {
  const repository = getRepository(dependencies);
  const notifications = await repository.findRetryableFailedNotifications(dependencies.now || new Date());
  const results = [];

  for (const notification of notifications) {
    if (notification.attempts >= notification.maxAttempts) {
      continue;
    }

    results.push(await sendNotification(notification._id, dependencies));
  }

  return results;
};

export const getMyNotifications = async (recipientId, dependencies = {}) => {
  const repository = getRepository(dependencies);
  const notifications = await repository.findUserNotifications(recipientId);

  return {
    success: true,
    message: "Notifications retrieved successfully",
    data: { notifications }
  };
};
