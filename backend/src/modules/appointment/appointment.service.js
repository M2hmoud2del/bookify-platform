import mongoose from "mongoose";

import { MAX_BOOKING_DAYS_AHEAD } from "../../config/constants.js";
import {
  getDateDifferenceInDays,
  getDayOfWeekFromDate,
  getProviderTodayDate,
  providerLocalDateTimeToUtc
} from "../availability/availability.service.js";
import { findWorkingHourByProviderAndDay } from "../availability/availability.repository.js";
import {
  doTimeRangesOverlap,
  timeToMinutes,
  minutesToTime
} from "../workingHours/slot.generator.js";
import { isValidDateString } from "../availability/availability.validators.js";
import { createAppointmentError } from "./appointment.errors.js";
import {
  createAppointment as createAppointmentRecord,
  findAppointmentById as findAppointmentByIdRecord,
  findBlockingAppointments,
  findCustomerAppointments,
  findProviderAppointments,
  findProviderProfileByUserId,
  findServiceById,
  updateAppointmentStatus
} from "./appointment.repository.js";

const finalStatuses = ["rejected", "cancelled", "completed"];

const validateObjectId = (id, message = "Invalid appointment id") => {
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    throw createAppointmentError(message, 400);
  }
};

const buildRepository = (dependencies = {}) =>
  dependencies.repository || {
    createAppointment: createAppointmentRecord,
    findAppointmentById: findAppointmentByIdRecord,
    findBlockingAppointments,
    findCustomerAppointments,
    findProviderAppointments,
    findProviderProfileByUserId,
    findServiceById,
    findWorkingHourByProviderAndDay,
    updateAppointmentStatus
  };

const ensureDateIsBookable = (date, timeZone, now = new Date()) => {
  if (!isValidDateString(date || "")) {
    throw createAppointmentError("date must use YYYY-MM-DD format", 400);
  }

  const providerToday = getProviderTodayDate(timeZone, now);
  const daysFromToday = getDateDifferenceInDays(providerToday, date);

  if (daysFromToday < 0) {
    throw createAppointmentError("Appointment date cannot be in the past", 400);
  }

  if (daysFromToday > MAX_BOOKING_DAYS_AHEAD) {
    throw createAppointmentError(
      `Appointments can only be booked up to ${MAX_BOOKING_DAYS_AHEAD} days ahead`,
      400
    );
  }
};

const assertSlotInsideWorkingHours = ({
  startTime,
  endTime,
  workingHour
}) => {
  if (!workingHour || workingHour.isClosed) {
    throw createAppointmentError("Selected time slot is outside provider working hours", 400);
  }

  const slotStart = timeToMinutes(startTime);
  const slotEnd = timeToMinutes(endTime);
  const workStart = timeToMinutes(workingHour.startTime);
  const workEnd = timeToMinutes(workingHour.endTime);

  if (slotStart < workStart || slotEnd > workEnd) {
    throw createAppointmentError("Selected time slot is outside provider working hours", 400);
  }
};

const assertSlotOutsideBreaks = ({ startTime, endTime, breaks = [] }) => {
  const slotStart = timeToMinutes(startTime);
  const slotEnd = timeToMinutes(endTime);
  const overlapsBreak = breaks.some((breakItem) =>
    doTimeRangesOverlap(
      slotStart,
      slotEnd,
      timeToMinutes(breakItem.startTime),
      timeToMinutes(breakItem.endTime)
    )
  );

  if (overlapsBreak) {
    throw createAppointmentError("Selected time slot is during provider break time", 400);
  }
};

const assertNoBlockingAppointment = ({ startTime, endTime, appointments }) => {
  const requestedStart = timeToMinutes(startTime);
  const requestedEnd = timeToMinutes(endTime);
  const hasConflict = appointments.some((appointment) =>
    doTimeRangesOverlap(
      requestedStart,
      requestedEnd,
      timeToMinutes(appointment.startTime),
      timeToMinutes(appointment.endTime)
    )
  );

  if (hasConflict) {
    throw createAppointmentError("Selected time slot is no longer available", 409);
  }
};

const assertSlotNotInPast = ({ localDate, startTime, timeZone, now }) => {
  const appointmentStart = providerLocalDateTimeToUtc(localDate, startTime, timeZone);

  if (appointmentStart <= now) {
    throw createAppointmentError("Appointment time cannot be in the past", 400);
  }
};

const canViewAppointment = (user, appointment) => {
  if (user.role === "admin") {
    return true;
  }

  if (user.role === "customer") {
    return String(appointment.customer?._id || appointment.customer) === String(user._id);
  }

  if (user.role === "provider") {
    return String(appointment.provider?._id || appointment.provider) === String(user._id);
  }

  return false;
};

const getRawId = (value) => String(value?._id || value);

export const createAppointment = async (customerId, payload, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const now = dependencies.now || new Date();
  const { providerId, serviceId, date, startTime, notes } = payload;

  validateObjectId(providerId, "Invalid providerId");
  validateObjectId(serviceId, "Invalid serviceId");

  const providerProfile = await repository.findProviderProfileByUserId(providerId);

  if (!providerProfile) {
    throw createAppointmentError("Provider not found", 404);
  }

  const timeZone = providerProfile.timezone || "UTC";

  ensureDateIsBookable(date, timeZone, now);

  const service = await repository.findServiceById(serviceId);

  if (!service) {
    throw createAppointmentError("Service not found", 404);
  }

  if (String(service.provider) !== String(providerId)) {
    throw createAppointmentError("Service does not belong to this provider", 400);
  }

  if (!service.isActive) {
    throw createAppointmentError("Service is inactive", 400);
  }

  const endTime = minutesToTime(timeToMinutes(startTime) + service.durationMinutes);
  const dayOfWeek = getDayOfWeekFromDate(date);
  const workingHour = await repository.findWorkingHourByProviderAndDay(providerId, dayOfWeek);

  assertSlotInsideWorkingHours({ startTime, endTime, workingHour });
  assertSlotOutsideBreaks({ startTime, endTime, breaks: workingHour.breaks || [] });
  assertSlotNotInPast({ localDate: date, startTime, timeZone, now });

  const blockingAppointments = await repository.findBlockingAppointments(providerId, date);
  assertNoBlockingAppointment({
    startTime,
    endTime,
    appointments: blockingAppointments
  });

  const appointment = await repository.createAppointment({
    customer: customerId,
    provider: providerId,
    service: serviceId,
    date: providerLocalDateTimeToUtc(date, "00:00", timeZone),
    localDate: date,
    startTime,
    endTime,
    timezone: timeZone,
    status: "pending_payment",
    paymentStatus: "unpaid",
    notes
  });

  return {
    success: true,
    message: "Appointment created successfully",
    data: appointment
  };
};

export const getMyAppointments = async (customerId, filters = {}, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const appointments = await repository.findCustomerAppointments(customerId, filters);

  return {
    success: true,
    message: "Customer appointments retrieved successfully",
    data: { appointments }
  };
};

export const getProviderAppointments = async (providerId, filters = {}, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const appointments = await repository.findProviderAppointments(providerId, filters);

  return {
    success: true,
    message: "Provider appointments retrieved successfully",
    data: { appointments }
  };
};

export const getAppointmentById = async (user, appointmentId, dependencies = {}) => {
  validateObjectId(appointmentId);

  const repository = buildRepository(dependencies);
  const appointment = await repository.findAppointmentById(appointmentId);

  if (!appointment) {
    throw createAppointmentError("Appointment not found", 404);
  }

  if (!canViewAppointment(user, appointment)) {
    throw createAppointmentError("Forbidden: You do not have permission", 403);
  }

  return {
    success: true,
    message: "Appointment retrieved successfully",
    data: { appointment }
  };
};

export const cancelAppointment = async (user, appointmentId, reason, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const { data } = await getAppointmentById(user, appointmentId, { repository });
  const appointment = data.appointment;

  if (!["customer", "provider"].includes(user.role)) {
    throw createAppointmentError("Forbidden: You do not have permission", 403);
  }

  if (appointment.status === "completed") {
    throw createAppointmentError("Completed appointments cannot be cancelled", 400);
  }

  if (appointment.status === "cancelled") {
    throw createAppointmentError("Appointment is already cancelled", 400);
  }

  const updatedAppointment = await repository.updateAppointmentStatus(appointmentId, {
    status: "cancelled",
    cancellationReason: reason,
    cancelledBy: user._id,
    cancelledAt: new Date()
  });

  return {
    success: true,
    message: "Appointment cancelled successfully",
    data: { appointment: updatedAppointment }
  };
};

export const rejectAppointment = async (providerId, appointmentId, reason, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  validateObjectId(appointmentId);

  const appointment = await repository.findAppointmentById(appointmentId);

  if (!appointment) {
    throw createAppointmentError("Appointment not found", 404);
  }

  if (getRawId(appointment.provider) !== String(providerId)) {
    throw createAppointmentError("Forbidden: You do not have permission", 403);
  }

  if (["completed", "cancelled", "rejected"].includes(appointment.status)) {
    throw createAppointmentError(`Cannot reject ${appointment.status} appointment`, 400);
  }

  const updatedAppointment = await repository.updateAppointmentStatus(appointmentId, {
    status: "rejected",
    rejectionReason: reason,
    rejectedAt: new Date()
  });

  return {
    success: true,
    message: "Appointment rejected successfully",
    data: { appointment: updatedAppointment }
  };
};

export const completeAppointment = async (providerId, appointmentId, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const now = dependencies.now || new Date();
  validateObjectId(appointmentId);

  const appointment = await repository.findAppointmentById(appointmentId);

  if (!appointment) {
    throw createAppointmentError("Appointment not found", 404);
  }

  if (getRawId(appointment.provider) !== String(providerId)) {
    throw createAppointmentError("Forbidden: You do not have permission", 403);
  }

  if (finalStatuses.includes(appointment.status)) {
    throw createAppointmentError(`Cannot complete ${appointment.status} appointment`, 400);
  }

  if (appointment.status !== "confirmed") {
    throw createAppointmentError("Only confirmed appointments can be completed", 400);
  }

  const appointmentEnd = providerLocalDateTimeToUtc(
    appointment.localDate,
    appointment.endTime,
    appointment.timezone || "UTC"
  );

  if (appointmentEnd > now) {
    throw createAppointmentError("Appointment can only be completed after its end time", 400);
  }

  const updatedAppointment = await repository.updateAppointmentStatus(appointmentId, {
    status: "completed",
    completedAt: new Date()
  });

  return {
    success: true,
    message: "Appointment completed successfully",
    data: { appointment: updatedAppointment }
  };
};

export const acceptAppointment = async () => {
  throw createAppointmentError("Appointment payment confirmation is handled in Phase 6", 400);
};
