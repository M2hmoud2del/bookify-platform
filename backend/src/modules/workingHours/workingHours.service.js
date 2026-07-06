import mongoose from "mongoose";

import {
  findProviderProfileByUserId,
  findWorkingHoursByProvider,
  upsertWorkingHours
} from "./workingHours.repository.js";
import { createWorkingHoursError } from "./workingHours.errors.js";
import { daysOfWeek } from "./workingHours.validators.js";
import { doTimeRangesOverlap, timeToMinutes } from "./slot.generator.js";

const allowedSlotIntervals = [15, 30, 45, 60];

const toPlainWorkingHour = (workingHour) => {
  const item = workingHour.toObject ? workingHour.toObject() : workingHour;

  return {
    dayOfWeek: item.dayOfWeek,
    startTime: item.startTime || null,
    endTime: item.endTime || null,
    isClosed: Boolean(item.isClosed),
    slotIntervalMinutes: item.slotIntervalMinutes || 30,
    breaks: item.breaks || []
  };
};

const getDefaultClosedDay = (dayOfWeek) => ({
  dayOfWeek,
  startTime: null,
  endTime: null,
  isClosed: true,
  slotIntervalMinutes: 30,
  breaks: []
});

export const mergeWithDefaultWeek = (workingHours = []) => {
  const existingByDay = new Map(
    workingHours.map((workingHour) => [workingHour.dayOfWeek, toPlainWorkingHour(workingHour)])
  );

  return daysOfWeek.map((dayOfWeek) => existingByDay.get(dayOfWeek) || getDefaultClosedDay(dayOfWeek));
};

const validateObjectId = (id, message = "Invalid provider id") => {
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    throw createWorkingHoursError(message, 400);
  }
};

const validateTimeOrder = (startTime, endTime, message) => {
  if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
    throw createWorkingHoursError(message, 400);
  }
};

export const normalizeWorkingHoursInput = (workingHours) => {
  const seenDays = new Set();

  return workingHours.map((workingHour) => {
    if (seenDays.has(workingHour.dayOfWeek)) {
      throw createWorkingHoursError(`Duplicate working hours for ${workingHour.dayOfWeek}`, 400);
    }

    seenDays.add(workingHour.dayOfWeek);

    if (!allowedSlotIntervals.includes(workingHour.slotIntervalMinutes || 30)) {
      throw createWorkingHoursError("slotIntervalMinutes must be one of 15, 30, 45, 60", 400);
    }

    if (workingHour.isClosed) {
      return {
        dayOfWeek: workingHour.dayOfWeek,
        startTime: null,
        endTime: null,
        isClosed: true,
        slotIntervalMinutes: workingHour.slotIntervalMinutes || 30,
        breaks: []
      };
    }

    if (!workingHour.startTime || !workingHour.endTime) {
      throw createWorkingHoursError("startTime and endTime are required when provider is open", 400);
    }

    validateTimeOrder(workingHour.startTime, workingHour.endTime, "startTime must be before endTime");

    const workStart = timeToMinutes(workingHour.startTime);
    const workEnd = timeToMinutes(workingHour.endTime);
    const breaks = workingHour.breaks || [];
    const normalizedBreaks = [];

    for (const breakItem of breaks) {
      validateTimeOrder(
        breakItem.startTime,
        breakItem.endTime,
        "Break startTime must be before break endTime"
      );

      const breakStart = timeToMinutes(breakItem.startTime);
      const breakEnd = timeToMinutes(breakItem.endTime);

      if (breakStart < workStart || breakEnd > workEnd) {
        throw createWorkingHoursError("Break times must be inside working hours", 400);
      }

      const overlapsExistingBreak = normalizedBreaks.some((existingBreak) =>
        doTimeRangesOverlap(breakStart, breakEnd, existingBreak.start, existingBreak.end)
      );

      if (overlapsExistingBreak) {
        throw createWorkingHoursError("Break times must not overlap", 400);
      }

      normalizedBreaks.push({
        start: breakStart,
        end: breakEnd
      });
    }

    return {
      dayOfWeek: workingHour.dayOfWeek,
      startTime: workingHour.startTime,
      endTime: workingHour.endTime,
      isClosed: false,
      slotIntervalMinutes: workingHour.slotIntervalMinutes || 30,
      breaks
    };
  });
};

export const getMyWorkingHours = async (providerId, dependencies = {}) => {
  const repository = dependencies.repository || { findWorkingHoursByProvider };
  const workingHours = await repository.findWorkingHoursByProvider(providerId);

  return {
    success: true,
    message: "Working hours retrieved successfully",
    data: {
      workingHours: mergeWithDefaultWeek(workingHours)
    }
  };
};

export const updateMyWorkingHours = async (providerId, workingHours, dependencies = {}) => {
  const repository = dependencies.repository || { findWorkingHoursByProvider, upsertWorkingHours };
  const normalizedWorkingHours = normalizeWorkingHoursInput(workingHours);

  await repository.upsertWorkingHours(providerId, normalizedWorkingHours);

  const updatedWorkingHours = await repository.findWorkingHoursByProvider(providerId);

  return {
    success: true,
    message: "Working hours updated successfully",
    data: {
      workingHours: mergeWithDefaultWeek(updatedWorkingHours)
    }
  };
};

export const getProviderWorkingHours = async (providerId, dependencies = {}) => {
  validateObjectId(providerId);

  const repository = dependencies.repository || {
    findProviderProfileByUserId,
    findWorkingHoursByProvider
  };
  const providerProfile = await repository.findProviderProfileByUserId(providerId);

  if (!providerProfile) {
    throw createWorkingHoursError("Provider not found", 404);
  }

  const workingHours = await repository.findWorkingHoursByProvider(providerId);

  return {
    success: true,
    message: "Provider working hours retrieved successfully",
    data: {
      providerId,
      workingHours: mergeWithDefaultWeek(workingHours)
    }
  };
};
