import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { mapBackendDashboard } from '../../../core/mappers/dashboard.mapper';
import { DashboardMetrics } from '../../../core/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private api = inject(ApiService);

  async getProviderDashboard(): Promise<DashboardMetrics> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.dashboard.provider));
    return mapBackendDashboard(response);
  }
}
