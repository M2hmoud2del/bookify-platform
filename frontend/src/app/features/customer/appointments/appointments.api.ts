import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { mapBackendAppointment, mapBackendAppointments } from '../../../core/mappers/appointment.mapper';
import { AppointmentFilters, AppointmentPayload, AppointmentView, BackendAppointment } from '../../../core/models/appointment.model';

interface AppointmentResponseBody {
  data?: unknown;
  appointment?: BackendAppointment;
  appointments?: BackendAppointment[];
}

@Injectable({ providedIn: 'root' })
export class AppointmentsApi {
  private api = inject(ApiService);

  async createAppointment(payload: AppointmentPayload): Promise<AppointmentView> {
    const response = await firstValueFrom(this.api.post<unknown>(API_ENDPOINTS.appointments.create, payload));
    return mapBackendAppointment(this.extractAppointment(response));
  }

  async getMyAppointments(filters?: AppointmentFilters): Promise<AppointmentView[]> {
    const response = await firstValueFrom(
      this.api.get<unknown>(API_ENDPOINTS.appointments.my, { params: this.cleanParams(filters) })
    );

    return mapBackendAppointments(this.extractAppointments(response));
  }

  async getProviderAppointments(filters?: AppointmentFilters): Promise<AppointmentView[]> {
    const response = await firstValueFrom(
      this.api.get<unknown>(API_ENDPOINTS.appointments.provider, { params: this.cleanParams(filters) })
    );

    return mapBackendAppointments(this.extractAppointments(response));
  }

  async getAppointmentById(id: string): Promise<AppointmentView> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.appointments.byId(id)));
    return mapBackendAppointment(this.extractAppointment(response));
  }

  async cancelAppointment(id: string, reason?: string): Promise<AppointmentView> {
    const response = await firstValueFrom(
      this.api.patch<unknown>(API_ENDPOINTS.appointments.cancel(id), { reason: reason ?? '' })
    );

    return mapBackendAppointment(this.extractAppointment(response));
  }

  async rejectAppointment(id: string, reason?: string): Promise<AppointmentView> {
    const response = await firstValueFrom(
      this.api.patch<unknown>(API_ENDPOINTS.appointments.reject(id), { reason: reason ?? '' })
    );

    return mapBackendAppointment(this.extractAppointment(response));
  }

  async completeAppointment(id: string): Promise<AppointmentView> {
    const response = await firstValueFrom(this.api.patch<unknown>(API_ENDPOINTS.appointments.complete(id), {}));
    return mapBackendAppointment(this.extractAppointment(response));
  }

  async acceptAppointment(id: string): Promise<AppointmentView> {
    const response = await firstValueFrom(this.api.patch<unknown>(API_ENDPOINTS.appointments.accept(id), {}));
    return mapBackendAppointment(this.extractAppointment(response));
  }

  private extractAppointment(response: unknown): BackendAppointment {
    const body = this.payload(response);
    const appointment = body.appointment || body;

    if (!appointment) {
      throw new Error('Appointment was not returned by the server.');
    }

    return appointment as BackendAppointment;
  }

  private extractAppointments(response: unknown): BackendAppointment[] {
    const body = this.payload(response);
    const appointments = body.appointments || body;
    return Array.isArray(appointments) ? appointments as BackendAppointment[] : [];
  }

  private payload(response: unknown): AppointmentResponseBody {
    const body = response as AppointmentResponseBody;
    return (body?.data as AppointmentResponseBody) || body;
  }

  private cleanParams(params?: AppointmentFilters): Record<string, string> {
    return Object.fromEntries(
      Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ) as Record<string, string>;
  }
}
