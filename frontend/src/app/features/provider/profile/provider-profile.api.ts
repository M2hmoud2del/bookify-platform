import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { mapBackendProviderProfile, mapBackendProviderToPublicProvider, MappedPublicProvider } from '../../../core/mappers/provider.mapper';
import { BackendProviderProfile, ProviderFilters, ProviderProfilePayload } from '../../../core/models/provider.model';
import { ProviderProfile } from '../../../core/models/user.model';

interface ProviderResponseBody {
  data?: unknown;
  profile?: BackendProviderProfile;
  provider?: BackendProviderProfile;
  providers?: BackendProviderProfile[];
}

@Injectable({ providedIn: 'root' })
export class ProviderProfileApi {
  private api = inject(ApiService);

  async getMyProviderProfile(): Promise<ProviderProfile> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.providerProfile.me));
    return mapBackendProviderProfile(this.extractProvider(response, 'profile'));
  }

  async updateMyProviderProfile(payload: ProviderProfilePayload): Promise<ProviderProfile> {
    const response = await firstValueFrom(
      this.api.put<unknown>(API_ENDPOINTS.providerProfile.me, payload)
    );

    return mapBackendProviderProfile(this.extractProvider(response, 'profile'));
  }

  async getProviders(params?: ProviderFilters): Promise<MappedPublicProvider[]> {
    const response = await firstValueFrom(
      this.api.get<unknown>(API_ENDPOINTS.providers.root, { params: this.cleanParams(params) })
    );

    return this.extractProviders(response).map((provider) => mapBackendProviderToPublicProvider(provider));
  }

  async getProviderById(providerId: string): Promise<MappedPublicProvider> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.providers.byId(providerId)));
    return mapBackendProviderToPublicProvider(this.extractProvider(response, 'provider'));
  }

  private extractProvider(response: unknown, key: 'profile' | 'provider'): BackendProviderProfile {
    const body = this.payload(response);
    const provider = body?.[key] || body?.profile || body?.provider || body;

    if (!provider) {
      throw new Error('Provider profile was not returned by the server.');
    }

    return provider as BackendProviderProfile;
  }

  private extractProviders(response: unknown): BackendProviderProfile[] {
    const body = this.payload(response);
    const providers = body?.providers || body;
    return Array.isArray(providers) ? providers as BackendProviderProfile[] : [];
  }

  private payload(response: unknown): ProviderResponseBody {
    const body = response as ProviderResponseBody;
    return (body?.data as ProviderResponseBody) || body;
  }

  private cleanParams(params?: ProviderFilters): Record<string, string> {
    return Object.fromEntries(
      Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ) as Record<string, string>;
  }
}
