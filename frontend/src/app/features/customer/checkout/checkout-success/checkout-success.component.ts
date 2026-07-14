import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { AppointmentView } from '../../../../core/models/appointment.model';
import { PaymentView } from '../../../../core/models/payment.model';
import { AppointmentsApi } from '../../appointments/appointments.api';
import { PaymentsApi } from '../../payments/payments.api';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent, StatusBadgeComponent],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css',
})
export class CheckoutSuccessComponent {
  private route = inject(ActivatedRoute);
  private appointmentsApi = inject(AppointmentsApi);
  private paymentsApi = inject(PaymentsApi);

  loading = signal(false);
  error = signal<string | null>(null);
  appointment = signal<AppointmentView | null>(null);
  payment = signal<PaymentView | null>(null);

  title = computed(() => {
    const appointment = this.appointment();
    if (appointment?.status === 'confirmed' && appointment.paymentStatus === 'paid') {
      return 'Booking Confirmed!';
    }

    return 'Payment Processing';
  });

  message = computed(() => {
    const appointment = this.appointment();
    if (appointment?.status === 'confirmed' && appointment.paymentStatus === 'paid') {
      return 'Your appointment has been confirmed by the backend after payment verification.';
    }

    return 'Stripe has redirected you back. We are showing the latest backend appointment and payment status.';
  });

  constructor() {
    void this.loadStatus();
  }

  async loadStatus(): Promise<void> {
    const appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');

    if (!appointmentId) {
      this.error.set('Appointment reference was not returned. Check your appointments page for the latest status.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const [appointment, payments] = await Promise.all([
        this.appointmentsApi.getAppointmentById(appointmentId),
        this.paymentsApi.getMyPayments(),
      ]);
      this.appointment.set(appointment);
      this.payment.set(payments.find(payment => this.paymentAppointmentId(payment) === appointmentId) || null);
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load checkout status.'));
    } finally {
      this.loading.set(false);
    }
  }

  formattedDate(): string {
    const value = this.appointment()?.localDate;
    return value ? new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  }

  formattedTime(): string {
    const value = this.appointment()?.startTime || '';
    if (!value) return '';
    const [h, m] = value.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  }

  amount(): number {
    return this.payment()?.amount ?? this.appointment()?.totalAmount ?? this.appointment()?.service.price ?? 0;
  }

  private paymentAppointmentId(payment: PaymentView): string {
    return typeof payment.appointment === 'string' ? payment.appointment : payment.appointment._id;
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
