export const MAX_BOOKING_DAYS_AHEAD = Number(process.env.MAX_BOOKING_DAYS_AHEAD || 60);
export const ENABLE_SCHEDULER = process.env.ENABLE_SCHEDULER !== "false";
export const APPOINTMENT_REMINDER_HOURS = Number(process.env.APPOINTMENT_REMINDER_HOURS || 24);
export const REVIEW_REQUEST_DELAY_HOURS = Number(process.env.REVIEW_REQUEST_DELAY_HOURS || 2);
export const PENDING_PAYMENT_EXPIRY_MINUTES = Number(
  process.env.PENDING_PAYMENT_EXPIRY_MINUTES || 15
);
