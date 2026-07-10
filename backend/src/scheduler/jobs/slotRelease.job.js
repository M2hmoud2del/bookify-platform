import Appointment from "../../models/Appointment.js";
import { PENDING_PAYMENT_EXPIRY_MINUTES } from "../../config/constants.js";

export const runSlotReleaseJob = async (dependencies = {}) => {
  const now = dependencies.now || new Date();
  const expiryMinutes = dependencies.expiryMinutes || PENDING_PAYMENT_EXPIRY_MINUTES;
  const expiresBefore = new Date(now.getTime() - expiryMinutes * 60 * 1000);
  const repository = dependencies.repository || {
    findExpiredPendingAppointments: () =>
      Appointment.find({
        status: "pending_payment",
        paymentStatus: "unpaid",
        createdAt: { $lte: expiresBefore }
      }),
    cancelExpired: (id) =>
      Appointment.findByIdAndUpdate(id, {
        status: "cancelled",
        cancellationReason: "Payment window expired",
        cancelledAt: now
      })
  };
  const appointments = await repository.findExpiredPendingAppointments(expiresBefore);
  let processed = 0;
  let failed = 0;

  for (const appointment of appointments) {
    if (appointment.status !== "pending_payment" || appointment.paymentStatus !== "unpaid") {
      continue;
    }

    try {
      await repository.cancelExpired(appointment._id, now);
      processed += 1;
    } catch (error) {
      failed += 1;
      console.error(`Slot release job failed for appointment ${appointment._id}: ${error.message}`);
    }
  }

  return { processed, failed };
};
