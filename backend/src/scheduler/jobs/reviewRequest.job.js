import mongoose from "mongoose";
import Appointment from "../../models/Appointment.js";
import Review from "../../models/Review.js";
import { REVIEW_REQUEST_DELAY_HOURS } from "../../config/constants.js";
import { sendReviewRequest } from "../../modules/notification/index.js";

export const runReviewRequestJob = async (dependencies = {}) => {
  const now = dependencies.now || new Date();
  const delayHours = dependencies.delayHours || REVIEW_REQUEST_DELAY_HOURS;
  const completedBefore = new Date(now.getTime() - delayHours * 60 * 60 * 1000);
  const repository = dependencies.repository || {
    findCandidates: () =>
      Appointment.find({
        status: "completed",
        completedAt: mongoose.trusted({ $lte: completedBefore }),
        reviewRequestSentAt: mongoose.trusted({ $exists: false })
      }),
    findReviewByAppointment: (appointmentId) => Review.findOne({ appointment: appointmentId }),
    markReviewRequestSent: (id) => Appointment.findByIdAndUpdate(id, { reviewRequestSentAt: now })
  };
  const notificationService = dependencies.notificationService || { sendReviewRequest };
  const appointments = await repository.findCandidates(completedBefore);
  let processed = 0;
  let failed = 0;

  for (const appointment of appointments) {
    if (appointment.status !== "completed" || appointment.reviewRequestSentAt) {
      continue;
    }

    const existingReview = await repository.findReviewByAppointment(appointment._id);

    if (existingReview) {
      continue;
    }

    try {
      await notificationService.sendReviewRequest(appointment._id);
      await repository.markReviewRequestSent(appointment._id, now);
      processed += 1;
    } catch (error) {
      failed += 1;
      console.error(`Review request job failed for appointment ${appointment._id}: ${error.message}`);
    }
  }

  return { processed, failed };
};
