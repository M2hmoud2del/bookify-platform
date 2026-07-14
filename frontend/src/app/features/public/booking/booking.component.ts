import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { PublicProvider } from '../shared/public.models';
import { Service } from '../../../core/models/user.model';
import { AvailabilitySlot } from '../../../core/models/availability.model';
import { ProviderProfileApi } from '../../provider/profile/provider-profile.api';
import { ProviderServicesApi } from '../../provider/services/provider-services.api';
import { AppointmentsApi } from '../../customer/appointments/appointments.api';
import { PaymentsApi } from '../../customer/payments/payments.api';
import { AvailabilityApi } from '../../customer/booking/availability.api';

@Component({
  selector: 'app-public-booking',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, AvatarComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class PublicBookingComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  private providerProfileApi = inject(ProviderProfileApi);
  private providerServicesApi = inject(ProviderServicesApi);
  private availabilityApi = inject(AvailabilityApi);
  private appointmentsApi = inject(AppointmentsApi);
  private paymentsApi = inject(PaymentsApi);

  today = new Date();
  currentMonth = signal(new Date());

  provider = signal<PublicProvider | undefined>(undefined);
  services = signal<Service[]>([]);
  selectedService = signal<Service | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);
  availabilitySlots = signal<AvailabilitySlot[]>([]);
  loading = signal(false);
  loadingSlots = signal(false);
  creatingAppointment = signal(false);
  error = signal<string | null>(null);

  monthYear = computed(() => {
    return this.currentMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  calendarDates = computed(() => {
    const current = this.currentMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      dates.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  });

  constructor() {
    void this.loadProvider();
  }

  async loadProvider(): Promise<void> {
    const providerId = this.route.snapshot.paramMap.get('providerId');

    if (!providerId) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const provider = await this.providerProfileApi.getProviderById(providerId);
      const services = await this.providerServicesApi.getProviderServices(provider.profile._id);
      this.provider.set({ ...provider, services } as PublicProvider);
      this.services.set(services);
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load booking details.'));
    } finally {
      this.loading.set(false);
    }
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  prevMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1));
  }

  nextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1));
  }

  selectService(service: Service): void {
    this.selectedService.set(service);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.availabilitySlots.set([]);
  }

  async selectDate(date: Date): Promise<void> {
    this.selectedDate.set(date);
    this.selectedTime.set(null);
    await this.loadAvailability();
  }

  async loadAvailability(): Promise<void> {
    const provider = this.provider();
    const service = this.selectedService();
    const date = this.selectedDate();

    if (!provider || !service || !date) {
      return;
    }

    this.loadingSlots.set(true);
    this.error.set(null);

    try {
      this.availabilitySlots.set(
        await this.availabilityApi.getAvailability(provider.user._id, service._id, this.toDateString(date))
      );
    } catch (err) {
      this.availabilitySlots.set([]);
      this.error.set(this.errorMessage(err, 'Unable to load available times.'));
    } finally {
      this.loadingSlots.set(false);
    }
  }

  async confirmBooking(): Promise<void> {
    const provider = this.provider();
    const service = this.selectedService();
    const date = this.selectedDate();
    const startTime = this.selectedTime();

    if (!provider || !service || !date || !startTime) {
      this.error.set('Select a service, date, and time before confirming.');
      return;
    }

    this.creatingAppointment.set(true);
    this.error.set(null);

    try {
      const appointment = await this.appointmentsApi.createAppointment({
        providerId: provider.user._id,
        serviceId: service._id,
        date: this.toDateString(date),
        startTime,
      });

      if (appointment.status === 'pending_payment') {
        const session = await this.paymentsApi.createCheckoutSession({
          appointmentId: appointment._id,
          successUrl: this.absoluteUrl(`/customer/checkout/success?appointmentId=${appointment._id}&session_id={CHECKOUT_SESSION_ID}`),
          cancelUrl: this.absoluteUrl(`/customer/checkout/failed?appointmentId=${appointment._id}`),
        });
        window.location.assign(session.checkoutUrl);
        return;
      }

      this.router.navigate(['/customer/appointments', appointment._id]);
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to create appointment.'));
    } finally {
      this.creatingAppointment.set(false);
    }
  }

  private absoluteUrl(path: string): string {
    return `${window.location.origin}${path}`;
  }

  private toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
