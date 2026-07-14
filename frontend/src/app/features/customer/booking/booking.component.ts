import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BookingCalendarComponent } from '../shared/booking-calendar.component';
import { TimeSlotSelectorComponent } from '../shared/time-slot-selector.component';
import { MOCK_TIME_SLOTS, TimeSlot } from '../shared/customer.models';
import { MOCK_PROVIDERS } from '../../public/shared/public.models';
import { Service } from '../../../core/models/user.model';

interface BookingProvider {
  id: string;
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
  private route = inject(ActivatedRoute);

  currentStep = signal(1);
  selectedProvider = signal<BookingProvider | null>(null);
  selectedService = signal<BookingService | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);

  steps = [
    { num: 1, label: 'Provider' },
    { num: 2, label: 'Service' },
    { num: 3, label: 'Date & Time' },
    { num: 4, label: 'Confirm' },
  ];

  providers = signal<BookingProvider[]>(
    MOCK_PROVIDERS.map(p => ({
      id: p.user._id,
      business_name: p.profile.businessName,
      business_type: p.profile.category ?? 'General',
      rating: p.profile.ratingAverage,
      avatar: p.user.avatar ?? null,
      services: p.services,
    }))
  );

  services = signal<BookingService[]>([]);

  availableDates = signal<string[]>([
    '2026-07-13', '2026-07-14', '2026-07-15', '2026-07-16',
    '2026-07-17', '2026-07-18', '2026-07-20', '2026-07-21',
    '2026-07-22', '2026-07-23', '2026-07-24',
  ]);

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

  selectProvider(provider: BookingProvider): void {
    this.selectedProvider.set(provider);
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
  }

  onDateChange(date: Date): void {
    this.selectedDate.set(date);
    this.timeSlots.set(MOCK_TIME_SLOTS);
    this.selectedTime.set(null);
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

  confirmBooking(): void {
    this.router.navigate(['/customer/checkout/success']);
  }
}
