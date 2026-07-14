import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { mapBackendAvailabilitySlots } from '../../../core/mappers/availability.mapper';
import { AvailabilitySlot, BackendAvailabilitySlot } from '../../../core/models/availability.model';

interface AvailabilityResponseBody {
  data?: unknown;
  slots?: BackendAvailabilitySlot[];
}

@Injectable({ providedIn: 'root' })
export class AvailabilityApi {
  private api = inject(ApiService);

  async getAvailability(providerId: string, serviceId: string, date: string): Promise<AvailabilitySlot[]> {
    const response = await firstValueFrom(
      this.api.get<unknown>(API_ENDPOINTS.availability.check, {
        params: { providerId, serviceId, date },
      })
    );

    return mapBackendAvailabilitySlots(this.extractSlots(response));
  }

  private extractSlots(response: unknown): BackendAvailabilitySlot[] {
    const body = this.payload(response);
    const slots = body.slots || body;
    return Array.isArray(slots) ? slots as BackendAvailabilitySlot[] : [];
  }

  private payload(response: unknown): AvailabilityResponseBody {
    const body = response as AvailabilityResponseBody;
    return (body?.data as AvailabilityResponseBody) || body;
  }
}
