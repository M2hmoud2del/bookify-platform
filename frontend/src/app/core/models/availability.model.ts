export interface BackendAvailabilitySlot {
  startTime?: string;
  endTime?: string;
  available?: boolean;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
  label: string;
}

export interface AvailabilityQuery {
  providerId: string;
  serviceId: string;
  date: string;
}
