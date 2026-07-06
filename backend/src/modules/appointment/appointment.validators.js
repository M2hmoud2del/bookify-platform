import Joi from "joi";

export const appointmentStatuses = [
  "pending_payment",
  "confirmed",
  "rejected",
  "cancelled",
  "completed"
];

export const blockingAppointmentStatuses = ["pending_payment", "confirmed"];

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createAppointmentSchema = Joi.object({
  providerId: Joi.string().pattern(objectIdPattern).required(),
  serviceId: Joi.string().pattern(objectIdPattern).required(),
  date: Joi.string().pattern(datePattern).required(),
  startTime: Joi.string().pattern(timePattern).required(),
  notes: Joi.string().trim().max(500).allow("").optional()
});

export const appointmentReasonSchema = Joi.object({
  reason: Joi.string().trim().max(500).allow("").optional()
});

export const appointmentListQuerySchema = Joi.object({
  status: Joi.string().valid(...appointmentStatuses).optional(),
  date: Joi.string().pattern(datePattern).optional(),
  from: Joi.string().pattern(datePattern).optional(),
  to: Joi.string().pattern(datePattern).optional()
});
