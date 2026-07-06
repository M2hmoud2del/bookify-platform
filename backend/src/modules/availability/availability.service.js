import mongoose from "mongoose";

import { MAX_BOOKING_DAYS_AHEAD } from "../../config/constants.js";
import { generateSlots } from "../workingHours/slot.generator.js";
import { daysOfWeek } from "../workingHours/workingHours.validators.js";
import {
  findActiveAppointmentsForDate,
  findProviderProfileByUserId,
  findServiceById,
  findWorkingHourByProviderAndDay
} from "./availability.repository.js";
import { isValidDateString } from "./availability.validators.js";

const createAvailabilityError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id, message) => {
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    throw createAvailabilityError(message, 400);
  }
};

export const getDayOfWeekFromDate = (date) => {
  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return daysOfWeek[parsedDate.getUTCDay()];
};

export const getProviderTodayDate = (timeZone, now = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value])
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
};

const dateStringToUtcMidnight = (date) => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
};

export const getDateDifferenceInDays = (fromDate, toDate) => {
  const oneDayMs = 24 * 60 * 60 * 1000;

  return Math.round(
    (dateStringToUtcMidnight(toDate).getTime() - dateStringToUtcMidnight(fromDate).getTime()) /
      oneDayMs
  );
};

const addDaysToDateString = (date, daysToAdd) => {
  const [year, month, day] = date.split("-").map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + daysToAdd));

  return [
    nextDate.getUTCFullYear(),
    String(nextDate.getUTCMonth() + 1).padStart(2, "0"),
    String(nextDate.getUTCDate()).padStart(2, "0")
  ].join("-");
};

const getTimeZoneOffsetMs = (timeZone, date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value])
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return asUtc - date.getTime();
};

export const providerLocalDateTimeToUtc = (date, time, timeZone) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  let utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  utcDate = new Date(utcDate.getTime() - getTimeZoneOffsetMs(timeZone, utcDate));
  utcDate = new Date(utcDate.getTime() - getTimeZoneOffsetMs(timeZone, utcDate));

  return utcDate;
};

// Availability receives provider-local dates as YYYY-MM-DD.
// Appointment reads still use UTC Date ranges until Phase 5 booking normalization.
export const getDateRange = (date, timeZone = "UTC") => {
  const dateStart = providerLocalDateTimeToUtc(date, "00:00", timeZone);
  const dateEnd = providerLocalDateTimeToUtc(addDaysToDateString(date, 1), "00:00", timeZone);

  return { dateStart, dateEnd };
};

const validateBookingWindow = (date, timeZone, now = new Date()) => {
  const providerToday = getProviderTodayDate(timeZone, now);
  const daysFromToday = getDateDifferenceInDays(providerToday, date);

  if (daysFromToday < 0) {
    throw createAvailabilityError("Availability date cannot be in the past", 400);
  }

  if (daysFromToday > MAX_BOOKING_DAYS_AHEAD) {
    throw createAvailabilityError(
      `Availability can only be checked up to ${MAX_BOOKING_DAYS_AHEAD} days ahead`,
      400
    );
  }
};

const buildEmptyAvailabilityResponse = ({ providerId, serviceId, date, durationMinutes }) => ({
  success: true,
  message: "Available slots retrieved successfully",
  data: {
    providerId,
    serviceId,
    date,
    durationMinutes,
    slots: []
  }
});

export const getAvailability = async (query, dependencies = {}) => {
  const repository = dependencies.repository || {
    findActiveAppointmentsForDate,
    findProviderProfileByUserId,
    findServiceById,
    findWorkingHourByProviderAndDay
  };
  const now = dependencies.now || new Date();
  const { providerId, serviceId, date } = query;

  validateObjectId(providerId, "Invalid providerId");
  validateObjectId(serviceId, "Invalid serviceId");

  if (!isValidDateString(date || "")) {
    throw createAvailabilityError("date must use YYYY-MM-DD format", 400);
  }

  const providerProfile = await repository.findProviderProfileByUserId(providerId);

  if (!providerProfile) {
    throw createAvailabilityError("Provider not found", 404);
  }

  const providerTimezone = providerProfile.timezone || "UTC";

  validateBookingWindow(date, providerTimezone, now);

  const service = await repository.findServiceById(serviceId);

  if (!service) {
    throw createAvailabilityError("Service not found", 404);
  }

  if (String(service.provider) !== String(providerId)) {
    throw createAvailabilityError("Service does not belong to this provider", 400);
  }

  if (!service.isActive) {
    throw createAvailabilityError("Service is inactive", 400);
  }

  const dayOfWeek = getDayOfWeekFromDate(date);
  const workingHour = await repository.findWorkingHourByProviderAndDay(providerId, dayOfWeek);

  if (!workingHour || workingHour.isClosed) {
    return buildEmptyAvailabilityResponse({
      providerId,
      serviceId,
      date,
      durationMinutes: service.durationMinutes
    });
  }

  const { dateStart, dateEnd } = getDateRange(date, providerTimezone);
  const existingAppointments = await repository.findActiveAppointmentsForDate(
    providerId,
    serviceId,
    dateStart,
    dateEnd
  );

  const slots = generateSlots({
    startTime: workingHour.startTime,
    endTime: workingHour.endTime,
    durationMinutes: service.durationMinutes,
    slotIntervalMinutes: workingHour.slotIntervalMinutes || 30,
    breaks: workingHour.breaks || [],
    existingAppointments,
    date,
    timeZone: providerTimezone,
    now
  });

  return {
    success: true,
    message: "Available slots retrieved successfully",
    data: {
      providerId,
      serviceId,
      date,
      durationMinutes: service.durationMinutes,
      slots
    }
  };
};
