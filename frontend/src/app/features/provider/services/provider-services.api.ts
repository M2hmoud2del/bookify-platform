import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { mapBackendService, mapBackendServices } from '../../../core/mappers/service.mapper';
import { BackendService, ServiceFilters, ServicePayload } from '../../../core/models/service.model';
import { Service } from '../../../core/models/user.model';

interface ServiceResponseBody {
  data?: unknown;
  service?: BackendService;
  services?: BackendService[];
}

@Injectable({ providedIn: 'root' })
export class ProviderServicesApi {
  private api = inject(ApiService);

  async createService(payload: ServicePayload): Promise<Service> {
    const response = await firstValueFrom(this.api.post<unknown>(API_ENDPOINTS.services.root, payload));
    return mapBackendService(this.extractService(response));
  }

  async getServices(params?: ServiceFilters): Promise<Service[]> {
    const response = await firstValueFrom(
      this.api.get<unknown>(API_ENDPOINTS.services.root, { params: this.cleanParams(params) })
    );

    return mapBackendServices(this.extractServices(response));
  }

  async getServiceById(serviceId: string): Promise<Service> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.services.byId(serviceId)));
    return mapBackendService(this.extractService(response));
  }

  async getProviderServices(providerId: string): Promise<Service[]> {
    const response = await firstValueFrom(
      this.api.get<unknown>(API_ENDPOINTS.providerServices.byProvider(providerId))
    );

    return mapBackendServices(this.extractServices(response));
  }

  async updateService(serviceId: string, payload: ServicePayload): Promise<Service> {
    const response = await firstValueFrom(
      this.api.put<unknown>(API_ENDPOINTS.services.byId(serviceId), payload)
    );

    return mapBackendService(this.extractService(response));
  }

  async deleteService(serviceId: string): Promise<void> {
    await firstValueFrom(this.api.delete<unknown>(API_ENDPOINTS.services.byId(serviceId)));
  }

  async updateServiceStatus(serviceId: string, isActive: boolean): Promise<Service> {
    const response = await firstValueFrom(
      this.api.patch<unknown>(API_ENDPOINTS.services.status(serviceId), { isActive })
    );

    return mapBackendService(this.extractService(response));
  }

  private extractService(response: unknown): BackendService {
    const body = this.payload(response);
    const service = body?.service || body;

    if (!service) {
      throw new Error('Service was not returned by the server.');
    }

    return service as BackendService;
  }

  private extractServices(response: unknown): BackendService[] {
    const body = this.payload(response);
    const services = body?.services || body;
    return Array.isArray(services) ? services as BackendService[] : [];
  }

  private payload(response: unknown): ServiceResponseBody {
    const body = response as ServiceResponseBody;
    return (body?.data as ServiceResponseBody) || body;
  }

  private cleanParams(params?: ServiceFilters): Record<string, string | number> {
    return Object.fromEntries(
      Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ) as Record<string, string | number>;
  }
}
