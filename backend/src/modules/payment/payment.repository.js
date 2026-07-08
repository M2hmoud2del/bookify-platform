import Appointment from "../../models/Appointment.js";
import Payment from "../../models/Payment.js";

export const findAppointmentForCheckout = (appointmentId) => {
  return Appointment.findById(appointmentId)
    .populate("customer", "name email role")
    .populate("provider", "name email role")
    .populate("service", "title description price durationMinutes category");
};

export const findPaymentByAppointment = (appointmentId) => {
  return Payment.findOne({ appointment: appointmentId });
};

export const findPaymentByStripeSessionId = (stripeSessionId) => {
  return Payment.findOne({ stripeSessionId });
};

export const findPaymentByStripePaymentIntentId = (stripePaymentIntentId) => {
  return Payment.findOne({ stripePaymentIntentId });
};

export const upsertPendingPayment = (paymentData) => {
  return Payment.findOneAndUpdate(
    { appointment: paymentData.appointment },
    paymentData,
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );
};

export const updatePayment = (paymentId, updateData) => {
  return Payment.findByIdAndUpdate(paymentId, updateData, {
    new: true,
    runValidators: true
  });
};

export const findPaymentsForUser = (user) => {
  const filter = user.role === "provider"
    ? { provider: user._id }
    : { customer: user._id };

  return Payment.find(filter)
    .populate({
      path: "appointment",
      populate: [
        { path: "service", select: "title price durationMinutes category" },
        { path: "customer", select: "name email phone role" },
        { path: "provider", select: "name email phone role" }
      ]
    })
    .sort({ createdAt: -1 });
};

export const confirmAppointmentPayment = (appointmentId) => {
  return Appointment.findByIdAndUpdate(
    appointmentId,
    {
      status: "confirmed",
      paymentStatus: "paid"
    },
    {
      new: true,
      runValidators: true
    }
  );
};

export const markAppointmentPaymentRefunded = (appointmentId) => {
  return Appointment.findByIdAndUpdate(
    appointmentId,
    {
      paymentStatus: "refunded"
    },
    {
      new: true,
      runValidators: true
    }
  );
};
