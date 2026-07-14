import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AppointmentView } from '../../../core/models/appointment.model';
import { PaymentView } from '../../../core/models/payment.model';
import { PaymentsApi } from './payments.api';

@Component({
  selector: 'app-customer-payments',
  standalone: true,
  imports: [CommonModule, CardComponent, StatusBadgeComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class CustomerPaymentsComponent {
  private paymentsApi = inject(PaymentsApi);

  payments = signal<PaymentView[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  hasPayments = computed(() => this.payments().length > 0);

  constructor() {
    void this.loadPayments();
  }

  async loadPayments(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.payments.set(await this.paymentsApi.getMyPayments());
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load payments.'));
    } finally {
      this.loading.set(false);
    }
  }

  serviceName(payment: PaymentView): string {
    const appointment = this.appointment(payment);
    return appointment?.service.title || 'Appointment payment';
  }

  providerName(payment: PaymentView): string {
    const appointment = this.appointment(payment);
    const provider = appointment?.provider || payment.provider;
    return typeof provider === 'string' ? 'Provider' : provider.name;
  }

  paymentDate(payment: PaymentView): string {
    return new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private appointment(payment: PaymentView): AppointmentView | null {
    return typeof payment.appointment === 'string' ? null : payment.appointment;
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
