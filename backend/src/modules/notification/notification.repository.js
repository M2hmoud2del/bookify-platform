import mongoose from "mongoose";

import Appointment from "../../models/Appointment.js";
import Notification from "./notification.model.js";
import Payment from "../../models/Payment.js";

export const createNotification = (data) => Notification.create(data);

export const findNotificationById = (id) => Notification.findById(id);

export const findUserNotifications = (recipientId) =>
  Notification.find({ recipient: recipientId }).sort({ createdAt: -1 });

export const markNotificationSent = (id, update = {}) =>
  Notification.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "sent",
        lastError: undefined,
        nextRetryAt: undefined,
        sentAt: update.sentAt || new Date(),
        metadata: update.metadata || {}
      },
      $inc: { attempts: 1 }
    },
    { new: true }
  );

export const markNotificationFailed = (id, error, nextRetryAt) =>
  Notification.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "failed",
        lastError: error,
        nextRetryAt
      },
      $inc: { attempts: 1 }
    },
    { new: true }
  );

export const findRetryableFailedNotifications = (now = new Date()) =>
  Notification.find({
    status: "failed",
    nextRetryAt: mongoose.trusted({ $lte: now }),
    $expr: mongoose.trusted({ $lt: ["$attempts", "$maxAttempts"] })
  });

export const findAppointmentById = (appointmentId) =>
  Appointment.findById(appointmentId)
    .populate("customer", "name email phone role")
    .populate("provider", "name email phone role")
    .populate("service", "title price durationMinutes category");

export const findPaymentById = (paymentId) =>
  Payment.findById(paymentId)
    .populate("customer", "name email phone role")
    .populate("provider", "name email phone role")
    .populate("appointment");
