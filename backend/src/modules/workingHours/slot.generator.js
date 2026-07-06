const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const blockingAppointmentStatuses = ["pending_payment", "confirmed"];

export const timeToMinutes = (time) => {
  if (!timeRegex.test(time)) {
    throw new Error("Time must use HH:mm format");
  }

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
};

export const doTimeRangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && bStart < aEnd;
};

export const getProviderDateTimeParts = (timeZone = "UTC", now = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value])
  );

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute
  };
};

export const getProviderTodayString = (timeZone = "UTC", now = new Date()) => {
  const parts = getProviderDateTimeParts(timeZone, now);

  return `${parts.year}-${parts.month}-${parts.day}`;
};

export const getProviderCurrentMinutes = (timeZone = "UTC", now = new Date()) => {
  const parts = getProviderDateTimeParts(timeZone, now);

  return Number(parts.hour) * 60 + Number(parts.minute);
};

export const generateSlots = ({
  startTime,
  endTime,
  durationMinutes,
  slotIntervalMinutes = 30,
  breaks = [],
  existingAppointments = [],
  date,
  timeZone = "UTC",
  now = new Date()
}) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const isToday = date === getProviderTodayString(timeZone, now);
  const currentMinutes = getProviderCurrentMinutes(timeZone, now);
  const normalizedBreaks = breaks.map((breakItem) => ({
    start: timeToMinutes(breakItem.startTime),
    end: timeToMinutes(breakItem.endTime)
  }));
  const normalizedAppointments = existingAppointments
    .filter(
      (appointment) =>
        !appointment.status || blockingAppointmentStatuses.includes(appointment.status)
    )
    .map((appointment) => ({
      start: timeToMinutes(appointment.startTime),
      end: timeToMinutes(appointment.endTime)
    }));
  const slots = [];

  for (
    let slotStart = startMinutes;
    slotStart + durationMinutes <= endMinutes;
    slotStart += slotIntervalMinutes
  ) {
    const slotEnd = slotStart + durationMinutes;

    if (isToday && slotStart <= currentMinutes) {
      continue;
    }

    const overlapsBreak = normalizedBreaks.some((breakItem) =>
      doTimeRangesOverlap(slotStart, slotEnd, breakItem.start, breakItem.end)
    );

    if (overlapsBreak) {
      continue;
    }

    const overlapsAppointment = normalizedAppointments.some((appointment) =>
      doTimeRangesOverlap(slotStart, slotEnd, appointment.start, appointment.end)
    );

    if (overlapsAppointment) {
      continue;
    }

    slots.push({
      startTime: minutesToTime(slotStart),
      endTime: minutesToTime(slotEnd),
      available: true
    });
  }

  return slots;
};
