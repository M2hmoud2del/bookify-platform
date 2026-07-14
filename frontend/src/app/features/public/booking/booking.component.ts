import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-public-booking',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, AvatarComponent, BadgeComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class PublicBookingComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  today = new Date();
  currentMonth = new Date();

  selectedService = signal<any>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);

  provider = signal({
    id: '1',
    business_name: 'Blossom Beauty Salon',
    business_type: 'Beauty Salon',
    rating: 4.9,
    total_reviews: 128,
  });

  services = signal([
    { id: '1', name: 'Haircut & Styling', description: 'Professional haircut and styling session', duration_minutes: 45, price: 65 },
    { id: '2', name: 'Hair Coloring', description: 'Full hair coloring service', duration_minutes: 90, price: 120 },
    { id: '3', name: 'Beard Trim', description: 'Professional beard grooming', duration_minutes: 30, price: 35 },
    { id: '4', name: 'Facial Treatment', description: 'Rejuvenating facial treatment', duration_minutes: 60, price: 85 },
  ]);

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
