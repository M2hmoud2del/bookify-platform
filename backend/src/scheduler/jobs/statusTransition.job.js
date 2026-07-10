import Appointment from "../../models/Appointment.js";
import { providerLocalDateTimeToUtc } from "../../modules/availability/availability.service.js";

const shouldCompleteAppointment = (appointment, now) => {
  if (appointment.status !== "confirmed") {
    return false;
  }

  const endAt = providerLocalDateTimeToUtc(
    appointment.localDate,
    appointment.endTime,
    appointment.timezone || "UTC"
  );

  return endAt <= now;
};

export const runStatusTransitionJob = async (dependencies = {}) => {
  const now = dependencies.now || new Date();
  const repository = dependencies.repository || {
    findCandidates: () => Appointment.find({ status: "confirmed" }),
    markCompleted: (id) =>
      Appointment.findByIdAndUpdate(id, {
        status: "completed",
        completedAt: now
      })
  };
  const candidates = await repository.findCandidates(now);
  let processed = 0;
  let failed = 0;

  for (const appointment of candidates) {
    if (!shouldCompleteAppointment(appointment, now)) {
      continue;
    }

    try {
      await repository.markCompleted(appointment._id, now);
      processed += 1;
    } catch (error) {
      failed += 1;
      console.error(`Status transition job failed for appointment ${appointment._id}: ${error.message}`);
    }
  }

  return { processed, failed };
};
