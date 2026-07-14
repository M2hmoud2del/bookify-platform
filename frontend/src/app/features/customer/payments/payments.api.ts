import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { mapBackendPayments, mapCheckoutSessionResult } from '../../../core/mappers/payment.mapper';
import { BackendPayment, CheckoutSessionPayload, CheckoutSessionResult, PaymentView } from '../../../core/models/payment.model';

interface PaymentResponseBody {
  data?: unknown;
  payment?: BackendPayment;
  payments?: BackendPayment[];
  checkoutUrl?: string;
  url?: string;
  sessionId?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentsApi {
  private api = inject(ApiService);

  async createCheckoutSession(payload: string | CheckoutSessionPayload): Promise<CheckoutSessionResult> {
    const requestPayload = typeof payload === 'string' ? { appointmentId: payload } : payload;
    const response = await firstValueFrom(
      this.api.post<unknown>(API_ENDPOINTS.payments.createCheckoutSession, requestPayload)
    );

    return mapCheckoutSessionResult(response);
  }

  async getMyPayments(): Promise<PaymentView[]> {
    const response = await firstValueFrom(this.api.get<unknown>(API_ENDPOINTS.payments.my));
    return mapBackendPayments(this.extractPayments(response));
  }

  private extractPayments(response: unknown): BackendPayment[] {
    const body = this.payload(response);
    const payments = body.payments || body;
    return Array.isArray(payments) ? payments as BackendPayment[] : [];
  }

  private payload(response: unknown): PaymentResponseBody {
    const body = response as PaymentResponseBody;
    return (body?.data as PaymentResponseBody) || body;
  }
}
