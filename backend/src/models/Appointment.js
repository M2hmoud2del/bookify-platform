import mongoose from "mongoose";

const activeAppointmentStatuses = ["pending_payment", "confirmed"];
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true
    },
    localDate: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    startTime: {
      type: String,
      required: true,
      match: [timeRegex, "Start time must use HH:mm format"]
    },
    endTime: {
      type: String,
      required: true,
      match: [timeRegex, "End time must use HH:mm format"]
    },
    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "rejected", "cancelled", "completed"],
      default: "pending_payment"
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    },
    notes: {
      type: String,
      trim: true
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true
    },
    cancellationReason: {
      type: String,
      trim: true
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    cancelledAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      trim: true
    },
    rejectedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    reminderSentAt: {
      type: Date
    },
    reviewRequestSentAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    strict: true
  }
);

appointmentSchema.index({ service: 1, date: 1 });
appointmentSchema.index({ provider: 1, date: 1, startTime: 1, status: 1 });
appointmentSchema.index({ provider: 1, localDate: 1, startTime: 1 });
appointmentSchema.index({ status: 1 });

appointmentSchema.pre("validate", async function preventDoubleBooking() {
  if (
    !this.isModified("provider") &&
    !this.isModified("date") &&
    !this.isModified("startTime") &&
    !this.isModified("status")
  ) {
    return;
  }

  if (!activeAppointmentStatuses.includes(this.status)) {
    return;
  }

  const existingAppointment = await this.constructor.exists({
    _id: mongoose.trusted({ $ne: this._id }),
    provider: this.provider,
    date: this.date,
    startTime: this.startTime,
    status: mongoose.trusted({ $in: activeAppointmentStatuses })
  });

  if (existingAppointment) {
    throw new Error("Provider already has an active appointment at this time");
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

