import { AvailabilitySlot, BackendAvailabilitySlot } from '../models/availability.model';

export interface AvailabilityTimeSlot {
  time: string;
  label: string;
  available: boolean;
}

export function mapBackendAvailabilitySlot(slot: BackendAvailabilitySlot): AvailabilitySlot {
  const startTime = slot.startTime || '';
  const endTime = slot.endTime || '';

  return {
    startTime,
    endTime,
    available: slot.available ?? true,
    label: formatTimeLabel(startTime),
  };
}

export function mapBackendAvailabilitySlots(slots: BackendAvailabilitySlot[] = []): AvailabilitySlot[] {
  return slots.map(mapBackendAvailabilitySlot);
}

export function mapAvailabilitySlotsToTimeSlots(slots: AvailabilitySlot[]): AvailabilityTimeSlot[] {
  return slots.map((slot) => ({
    time: slot.startTime,
    label: slot.label,
    available: slot.available,
  }));
}

export function formatTimeLabel(time: string): string {
  const [hoursRaw, minutes = '00'] = time.split(':');
  const hours = Number(hoursRaw);

  if (Number.isNaN(hours)) {
    return time;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${minutes} ${period}`;
}
