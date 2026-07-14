import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { mapBackendWorkingHours, mapWorkingHoursPayload } from '../../../core/mappers/working-hours.mapper';
import { BackendWorkingHour } from '../../../core/models/working-hours.model';
import { WorkingHour } from '../../../core/models/user.model';

interface WorkingHoursResponseBody {
  data?: unknown;
  workingHours?: BackendWorkingHour[];
}

@Injectable({ providedIn: 'root' })
export class WorkingHoursApi {
  private api = inject(ApiService);

  async getMyWorkingHours(): Promise<WorkingHour[]> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.workingHours.my));
    return mapBackendWorkingHours(this.extractWorkingHours(response));
  }

  async updateMyWorkingHours(workingHours: WorkingHour[]): Promise<WorkingHour[]> {
    const response = await firstValueFrom(
      this.api.put<unknown>(API_ENDPOINTS.workingHours.my, {
        workingHours: mapWorkingHoursPayload(workingHours),
      })
    );

    return mapBackendWorkingHours(this.extractWorkingHours(response));
  }

  async getProviderWorkingHours(providerId: string): Promise<WorkingHour[]> {
    const response = await firstValueFrom(
      this.api.get<unknown>(API_ENDPOINTS.workingHours.provider(providerId))
    );

    return mapBackendWorkingHours(this.extractWorkingHours(response));
  }

  private extractWorkingHours(response: unknown): BackendWorkingHour[] {
    const body = this.payload(response);
    const workingHours = body.workingHours || body;
    return Array.isArray(workingHours) ? workingHours as BackendWorkingHour[] : [];
  }

  private payload(response: unknown): WorkingHoursResponseBody {
    const body = response as WorkingHoursResponseBody;
    return (body?.data as WorkingHoursResponseBody) || body;
  }
}
