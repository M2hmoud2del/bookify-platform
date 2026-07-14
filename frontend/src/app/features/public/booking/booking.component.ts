import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { getProviderById, getServiceById } from '../shared/public.models';
import { Service } from '../../../core/models/user.model';

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

  today = new Date();
  currentMonth = new Date();

  selectedService = signal<Service | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);

  provider = computed(() => getProviderById('1'));

  services = computed(() => this.provider()?.services ?? []);

  availableTimes = signal(['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']);

  monthYear = computed(() => {
    return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  calendarDates = computed(() => {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
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

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
  }

  confirmBooking(): void {
    this.router.navigate(['/checkout/success']);
  }
}
