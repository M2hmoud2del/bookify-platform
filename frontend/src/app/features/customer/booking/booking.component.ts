import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BookingCalendarComponent } from '../shared/booking-calendar.component';
import { TimeSlotSelectorComponent } from '../shared/time-slot-selector.component';
import { TimeSlot } from '../shared/customer.models';
import { Service } from '../../../core/models/user.model';
import { mapAvailabilitySlotsToTimeSlots } from '../../../core/mappers/availability.mapper';
import { ProviderProfileApi } from '../../provider/profile/provider-profile.api';
import { ProviderServicesApi } from '../../provider/services/provider-services.api';
import { AppointmentsApi } from '../appointments/appointments.api';
import { PaymentsApi } from '../payments/payments.api';
import { AvailabilityApi } from './availability.api';

interface BookingProvider {
  id: string;
  userId: string;
  business_name: string;
  business_type: string;
  rating: number;
  avatar: string | null;
  services: Service[];
}

interface BookingService {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
}

@Component({
  selector: 'app-booking-customer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    AvatarComponent,
    BookingCalendarComponent,
    TimeSlotSelectorComponent,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent {
  private router = inject(Router);
  private providerProfileApi = inject(ProviderProfileApi);
  private providerServicesApi = inject(ProviderServicesApi);
  private availabilityApi = inject(AvailabilityApi);
  private appointmentsApi = inject(AppointmentsApi);
  private paymentsApi = inject(PaymentsApi);

  currentStep = signal(1);
  selectedProvider = signal<BookingProvider | null>(null);
  selectedService = signal<BookingService | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);
  loading = signal(false);
  loadingSlots = signal(false);
  creatingAppointment = signal(false);
  error = signal<string | null>(null);

  steps = [
    { num: 1, label: 'Provider' },
    { num: 2, label: 'Service' },
    { num: 3, label: 'Date & Time' },
    { num: 4, label: 'Confirm' },
  ];

  providers = signal<BookingProvider[]>([]);
  services = signal<BookingService[]>([]);
  availableDates = signal<string[]>([]);
  timeSlots = signal<TimeSlot[]>([]);

  formattedDate = computed(() => {
    const d = this.selectedDate();
    return d ? d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  });

  formattedTime = computed(() => {
    const t = this.selectedTime();
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  });

  constructor() {
    void this.loadProviders();
  }

  async loadProviders(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const providers = await this.providerProfileApi.getProviders();
      const mappedProviders = await Promise.all(
        providers.map(async (provider) => {
          const services = await this.providerServicesApi.getProviderServices(provider.profile._id);
          return {
            id: provider.profile._id,
            userId: provider.user._id,
            business_name: provider.profile.businessName,
            business_type: provider.profile.category ?? 'General',
            rating: provider.profile.ratingAverage,
            avatar: provider.user.avatar ?? provider.profile.profileImage.url ?? null,
            services,
          };
        })
      );
      this.providers.set(mappedProviders);
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load providers.'));
    } finally {
      this.loading.set(false);
    }
  }

  selectProvider(provider: BookingProvider): void {
    this.selectedProvider.set(provider);
    this.selectedService.set(null);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.timeSlots.set([]);
    this.services.set(
      provider.services.map(s => ({
        id: s._id,
        name: s.title,
        description: s.description ?? '',
        duration_minutes: s.durationMinutes,
        price: s.price,
      }))
    );
  }

  selectService(service: BookingService): void {
    this.selectedService.set(service);
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.timeSlots.set([]);
  }

  async onDateChange(date: Date): Promise<void> {
    this.selectedDate.set(date);
    this.selectedTime.set(null);
    await this.loadAvailability();
  }

  async loadAvailability(): Promise<void> {
    const provider = this.selectedProvider();
    const service = this.selectedService();
    const date = this.selectedDate();

    if (!provider || !service || !date) {
      return;
    }

    this.loadingSlots.set(true);
    this.error.set(null);

    try {
      let slots = await this.availabilityApi.getAvailability(provider.userId, service.id, this.toDateString(date));
      
      const isToday = this.toDateString(date) === this.toDateString(new Date());
      if (isToday) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        slots = slots.filter(s => {
          const [h, m] = s.startTime.split(':').map(Number);
          return (h * 60 + m) > currentMinutes;
        });
      }

      this.timeSlots.set(mapAvailabilitySlotsToTimeSlots(slots));
    } catch (err) {
      this.timeSlots.set([]);
      this.error.set(this.errorMessage(err, 'Unable to load available times.'));
    } finally {
      this.loadingSlots.set(false);
    }
  }

  onTimeChange(time: string): void {
    this.selectedTime.set(time);
  }

  nextStep(): void {
    this.currentStep.update(v => Math.min(v + 1, 4));
  }

  prevStep(): void {
    this.currentStep.update(v => Math.max(v - 1, 1));
  }

  async confirmBooking(): Promise<void> {
    const provider = this.selectedProvider();
    const service = this.selectedService();
    const date = this.selectedDate();
    const startTime = this.selectedTime();

    if (!provider || !service || !date || !startTime) {
      this.error.set('Select a provider, service, date, and time before confirming.');
      return;
    }

    this.creatingAppointment.set(true);
    this.error.set(null);

    try {
      const appointment = await this.appointmentsApi.createAppointment({
        providerId: provider.userId,
        serviceId: service.id,
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
