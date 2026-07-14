import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AppointmentView } from '../../../core/models/appointment.model';
import { PaymentView } from '../../../core/models/payment.model';
import { PaymentsApi } from '../../customer/payments/payments.api';

@Component({
  selector: 'app-provider-payments',
  standalone: true,
  imports: [CommonModule, CardComponent, StatCardComponent, StatusBadgeComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class ProviderPaymentsComponent {
  private paymentsApi = inject(PaymentsApi);

  payments = signal<PaymentView[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  monthlyEarnings = computed(() => this.sumPayments(payment => this.isThisMonth(payment.createdAt) && payment.status === 'paid'));
  pendingEarnings = computed(() => this.sumPayments(payment => payment.status === 'pending'));
  totalEarnings = computed(() => this.sumPayments(payment => payment.status === 'paid'));
  monthlyEarningsLabel = computed(() => this.formatCurrency(this.monthlyEarnings()));
  pendingEarningsLabel = computed(() => this.formatCurrency(this.pendingEarnings()));
  totalEarningsLabel = computed(() => this.formatCurrency(this.totalEarnings()));

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
    return this.appointment(payment)?.service.title || 'Appointment payment';
  }

  customerName(payment: PaymentView): string {
    const appointment = this.appointment(payment);
    const customer = appointment?.customer || payment.customer;
    return typeof customer === 'string' ? 'Customer' : customer.name;
  }

  paymentDate(payment: PaymentView): string {
    return new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private appointment(payment: PaymentView): AppointmentView | null {
    return typeof payment.appointment === 'string' ? null : payment.appointment;
  }

  private sumPayments(predicate: (payment: PaymentView) => boolean): number {
    return this.payments().filter(predicate).reduce((sum, payment) => sum + payment.amount, 0);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  private isThisMonth(value: string): boolean {
    const date = new Date(value);
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
