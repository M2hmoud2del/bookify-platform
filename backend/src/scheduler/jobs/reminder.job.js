import mongoose from "mongoose";
import Appointment from "../../models/Appointment.js";
import { APPOINTMENT_REMINDER_HOURS } from "../../config/constants.js";
import { providerLocalDateTimeToUtc } from "../../modules/availability/availability.service.js";
import { sendAppointmentReminder } from "../../modules/notification/index.js";

const shouldSendReminder = (appointment, now, reminderHours) => {
  if (appointment.status !== "confirmed" || appointment.reminderSentAt) {
    return false;
  }

  const startAt = providerLocalDateTimeToUtc(
    appointment.localDate,
    appointment.startTime,
    appointment.timezone || "UTC"
  );
  const diffMs = startAt.getTime() - now.getTime();

  return diffMs > 0 && diffMs <= reminderHours * 60 * 60 * 1000;
};

export const runReminderJob = async (dependencies = {}) => {
  const now = dependencies.now || new Date();
  const reminderHours = dependencies.reminderHours || APPOINTMENT_REMINDER_HOURS;
  const repository = dependencies.repository || {
    findCandidates: () => Appointment.find({ status: "confirmed", reminderSentAt: mongoose.trusted({ $exists: false }) }),
    markReminderSent: (id) => Appointment.findByIdAndUpdate(id, { reminderSentAt: now })
  };
  const notificationService = dependencies.notificationService || { sendAppointmentReminder };
  const candidates = await repository.findCandidates(now);
  let processed = 0;
  let failed = 0;

  for (const appointment of candidates) {
    if (!shouldSendReminder(appointment, now, reminderHours)) {
      continue;
    }

    try {
      await notificationService.sendAppointmentReminder(appointment._id);
      await repository.markReminderSent(appointment._id, now);
      processed += 1;
    } catch (error) {
      failed += 1;
      console.error(`Reminder job failed for appointment ${appointment._id}: ${error.message}`);
    }
  }

  return { processed, failed };
};
