import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { PaymentsApi } from '../../payments/payments.api';

@Component({
  selector: 'app-checkout-failed',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './checkout-failed.component.html',
  styleUrl: './checkout-failed.component.css',
})
export class CheckoutFailedComponent {
  private route = inject(ActivatedRoute);
  private paymentsApi = inject(PaymentsApi);

  retrying = signal(false);
  error = signal<string | null>(null);
  appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');

  async retryPayment(): Promise<void> {
    if (!this.appointmentId) {
      return;
    }

    this.retrying.set(true);
    this.error.set(null);

    try {
      const session = await this.paymentsApi.createCheckoutSession({
        appointmentId: this.appointmentId,
        successUrl: this.absoluteUrl(`/customer/checkout/success?appointmentId=${this.appointmentId}&session_id={CHECKOUT_SESSION_ID}`),
        cancelUrl: this.absoluteUrl(`/customer/checkout/failed?appointmentId=${this.appointmentId}`),
      });
      window.location.assign(session.checkoutUrl);
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to restart payment.'));
    } finally {
      this.retrying.set(false);
    }
  }

  private absoluteUrl(path: string): string {
    return `${window.location.origin}${path}`;
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
