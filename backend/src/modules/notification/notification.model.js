import mongoose from "mongoose";

export const notificationTypes = [
  "booking_confirmation",
  "new_booking_alert",
  "appointment_reminder",
  "appointment_cancelled",
  "review_request",
  "payment_failed",
  "refund_issued",
  "email_verification",
  "password_reset"
];

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true
    },
    type: {
      type: String,
      enum: notificationTypes,
      required: true,
      index: true
    },
    channel: {
      type: String,
      enum: ["email"],
      default: "email"
    },
    toEmail: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
      index: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 3
    },
    lastError: {
      type: String,
      trim: true
    },
    sentAt: {
      type: Date
    },
    nextRetryAt: {
      type: Date,
      index: true
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true,
    strict: true
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
