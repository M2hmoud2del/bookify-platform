import { DayOfWeek, WorkingBreak, WorkingHour } from './user.model';

export interface BackendWorkingHour {
  _id?: string;
  provider?: string;
  dayOfWeek?: DayOfWeek;
  startTime?: string | null;
  endTime?: string | null;
  isClosed?: boolean;
  slotIntervalMinutes?: 15 | 30 | 45 | 60 | number;
  breaks?: WorkingBreak[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkingHoursPayloadItem {
  dayOfWeek: DayOfWeek;
  startTime: string | null;
  endTime: string | null;
  isClosed: boolean;
  slotIntervalMinutes: 15 | 30 | 45 | 60;
  breaks: WorkingBreak[];
}

export interface WorkingHoursPayload {
  workingHours: WorkingHoursPayloadItem[];
}

export const WEEKDAY_ORDER: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export type WorkingHourView = WorkingHour;
