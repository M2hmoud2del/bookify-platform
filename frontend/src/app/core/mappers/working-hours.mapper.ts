import { BackendWorkingHour, WEEKDAY_ORDER, WorkingHoursPayloadItem } from '../models/working-hours.model';
import { WorkingHour } from '../models/user.model';

export function mapBackendWorkingHour(item: BackendWorkingHour): WorkingHour {
  const dayOfWeek = item.dayOfWeek || 'sunday';
  const now = new Date().toISOString();

  return {
    _id: item._id || `working-hour-${dayOfWeek}`,
    provider: item.provider || '',
    dayOfWeek,
    startTime: item.startTime || undefined,
    endTime: item.endTime || undefined,
    isClosed: item.isClosed ?? true,
    slotIntervalMinutes: normalizeSlotInterval(item.slotIntervalMinutes),
    breaks: item.breaks || [],
    createdAt: item.createdAt || now,
    updatedAt: item.updatedAt || now,
  };
}

export function mapBackendWorkingHours(items: BackendWorkingHour[] = []): WorkingHour[] {
  const byDay = new Map(items.map((item) => [item.dayOfWeek, mapBackendWorkingHour(item)]));

  return WEEKDAY_ORDER.map((dayOfWeek) => byDay.get(dayOfWeek) || mapBackendWorkingHour({ dayOfWeek }));
}

export function mapWorkingHoursPayload(items: WorkingHour[]): WorkingHoursPayloadItem[] {
  return WEEKDAY_ORDER.map((dayOfWeek) => {
    const item = items.find((day) => day.dayOfWeek === dayOfWeek) || mapBackendWorkingHour({ dayOfWeek });

    if (item.isClosed) {
      return {
        dayOfWeek,
        startTime: null,
        endTime: null,
        isClosed: true,
        slotIntervalMinutes: normalizeSlotInterval(item.slotIntervalMinutes),
        breaks: [],
      };
    }

    return {
      dayOfWeek,
      startTime: item.startTime || '09:00',
      endTime: item.endTime || '17:00',
      isClosed: false,
      slotIntervalMinutes: normalizeSlotInterval(item.slotIntervalMinutes),
      breaks: item.breaks || [],
    };
  });
}

function normalizeSlotInterval(value?: number): 15 | 30 | 45 | 60 {
  return value === 15 || value === 45 || value === 60 ? value : 30;
}
