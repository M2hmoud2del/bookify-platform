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
  template: `
    <div class="public-booking">
      <div class="booking-header">
        <div class="provider-info">
          <app-avatar
            [name]="provider()?.business_name ?? ''"
            size="lg"
          />
          <div class="provider-details">
            <h1 class="provider-name">{{ provider()?.business_name }}</h1>
            <p class="provider-type">{{ provider()?.business_type }}</p>
            <div class="provider-rating">
              <span class="material-icons-outlined">star</span>
              <span>{{ provider()?.rating }}</span>
              <span class="review-count">({{ provider()?.total_reviews }} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="booking-content">
        <div class="services-section">
          <h2 class="section-title">Select a Service</h2>
          <div class="services-list">
            @for (service of services(); track service.id) {
              <div
                class="service-item"
                [ngClass]="{ 'is-selected': selectedService()?.id === service.id }"
                (click)="selectedService.set(service)"
              >
                <div class="service-info">
                  <h3 class="service-name">{{ service.name }}</h3>
                  @if (service.description) {
                    <p class="service-description">{{ service.description }}</p>
                  }
                  <div class="service-meta">
                    <span class="duration">
                      <span class="material-icons-outlined">schedule</span>
                      {{ service.duration_minutes }} min
                    </span>
                    <span class="price">{{ service.price | currency }}</span>
                  </div>
                </div>
                @if (selectedService()?.id === service.id) {
                  <span class="check-icon">
                    <span class="material-icons-outlined">check_circle</span>
                  </span>
                }
              </div>
            }
          </div>
        </div>

        @if (selectedService()) {
          <app-card title="Select Date & Time" class="datetime-section">
            <div class="datetime-grid">
              <div class="calendar-mini">
                <div class="calendar-header">
                  <button type="button" class="nav-btn" (click)="prevMonth()">
                    <span class="material-icons-outlined">chevron_left</span>
                  </button>
                  <span class="month-year">{{ monthYear() }}</span>
                  <button type="button" class="nav-btn" (click)="nextMonth()">
                    <span class="material-icons-outlined">chevron_right</span>
                  </button>
                </div>
                <div class="calendar-days">
                  <span class="day-label">Su</span>
                  <span class="day-label">Mo</span>
                  <span class="day-label">Tu</span>
                  <span class="day-label">We</span>
                  <span class="day-label">Th</span>
                  <span class="day-label">Fr</span>
                  <span class="day-label">Sa</span>
                </div>
                <div class="calendar-dates">
                  @for (date of calendarDates(); track $index) {
                    @if (date) {
                      <button
                        type="button"
                        class="date-btn"
                        [ngClass]="{
                          'is-selected': selectedDate()?.toDateString() === date.toDateString(),
                          'is-today': isToday(date),
                          'is-disabled': date < today
                        }"
                        [disabled]="date < today"
                        (click)="selectedDate.set(date)"
                      >
                        {{ date.getDate() }}
                      </button>
                    } @else {
                      <span class="date-empty"></span>
                    }
                  }
                </div>
              </div>
              <div class="times-list">
                <h3 class="times-title">Available Times</h3>
                @if (selectedDate()) {
                  <div class="times-grid">
                    @for (time of availableTimes(); track time) {
                      <button
                        type="button"
                        class="time-btn"
                        [ngClass]="{ 'is-selected': selectedTime() === time }"
                        (click)="selectedTime.set(time)"
                      >
                        {{ time }}
                      </button>
                    }
                  </div>
                } @else {
                  <p class="prompt">Select a date to see available times</p>
                }
              </div>
            </div>
          </app-card>
        }

        @if (selectedService() && selectedDate() && selectedTime()) {
          <app-card title="Booking Summary" class="summary-section">
            <div class="summary">
              <div class="summary-row">
                <span>Service</span>
                <span>{{ selectedService()?.name }}</span>
              </div>
              <div class="summary-row">
                <span>Date</span>
                <span>{{ selectedDate() | date:'MMM d, y' }}</span>
              </div>
              <div class="summary-row">
                <span>Time</span>
                <span>{{ selectedTime() }}</span>
              </div>
              <div class="summary-row">
                <span>Duration</span>
                <span>{{ selectedService()?.duration_minutes }} min</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-total">
                <span>Total</span>
                <span class="total-amount">{{ selectedService()?.price | currency }}</span>
              </div>
            </div>
            <app-button variant="primary" [fullWidth]="true" size="lg" (onClick)="confirmBooking()">
              Confirm Booking
            </app-button>
          </app-card>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: var(--space-6);
      max-width: 720px;
      margin: 0 auto;
    }

    .public-booking {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .booking-header {
      margin-bottom: var(--space-4);
    }

    .provider-info {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .provider-name {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .provider-type {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0;
    }

    .provider-rating {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .provider-rating .material-icons-outlined {
      color: var(--warning-500);
      font-size: 1rem;
    }

    .review-count {
      color: var(--text-secondary);
      font-size: var(--font-size-xs);
    }

    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
    }

    .services-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .service-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: var(--space-4);
      background: var(--gray-50);
      border: 2px solid transparent;
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .service-item {
      background: var(--gray-800);
    }

    .service-item:hover {
      border-color: var(--gray-300);
    }

    :host-context(.dark) .service-item:hover {
      border-color: var(--gray-600);
    }

    .service-item.is-selected {
      border-color: var(--primary-500);
      background: var(--primary-50);
    }

    :host-context(.dark) .service-item.is-selected {
      background: rgba(79, 70, 229, 0.1);
    }

    .service-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .service-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0;
    }

    .service-meta {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin-top: var(--space-2);
    }

    .duration {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .duration .material-icons-outlined {
      font-size: 1rem;
    }

    .price {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--primary-500);
    }

    .check-icon {
      color: var(--primary-500);
    }

    .check-icon .material-icons-outlined {
      font-size: 1.5rem;
    }

    .datetime-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    @media (min-width: 640px) {
      .datetime-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .calendar-mini {
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: var(--space-4);
    }

    :host-context(.dark) .calendar-mini {
      border-color: var(--gray-700);
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-3);
    }

    .nav-btn {
      display: flex;
      padding: var(--space-1);
      color: var(--text-secondary);
      border-radius: var(--radius-md);
    }

    .nav-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    :host-context(.dark) .nav-btn:hover {
      background: var(--gray-700);
    }

    .month-year {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-1);
      margin-bottom: var(--space-2);
    }

    .day-label {
      text-align: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      padding: var(--space-1);
    }

    .calendar-dates {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: var(--space-1);
    }

    .date-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      border-radius: var(--radius-md);
    }

    .date-btn:hover:not(:disabled) {
      background: var(--gray-100);
    }

    :host-context(.dark) .date-btn:hover:not(:disabled) {
      background: var(--gray-700);
    }

    .date-btn.is-today {
      border: 1px solid var(--primary-500);
    }

    .date-btn.is-selected {
      background: var(--primary-500);
      color: white;
    }

    .date-btn.is-disabled {
      color: var(--gray-300);
      cursor: not-allowed;
    }

    :host-context(.dark) .date-btn.is-disabled {
      color: var(--gray-600);
    }

    .times-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0 0 var(--space-3);
    }

    .times-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-2);
    }

    .time-btn {
      padding: var(--space-3) var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }

    :host-context(.dark) .time-btn {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .time-btn:hover {
      border-color: var(--primary-500);
    }

    .time-btn.is-selected {
      background: var(--primary-500);
      border-color: var(--primary-500);
      color: white;
    }

    .prompt {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-align: center;
      padding: var(--space-4);
    }

    .summary {
      margin-bottom: var(--space-4);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: var(--space-3) 0;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .summary-row span:last-child {
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
    }

    .summary-divider {
      height: 1px;
      background: var(--border);
      margin: var(--space-2) 0;
    }

    :host-context(.dark) .summary-divider {
      background: var(--gray-700);
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      padding: var(--space-3) 0;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .total-amount {
      font-size: var(--font-size-xl);
      color: var(--primary-500);
    }
  `],
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
