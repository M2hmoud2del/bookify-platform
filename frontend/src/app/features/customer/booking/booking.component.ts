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
  template: `
    <div class="booking-page">
      <div class="page-header">
        <h1 class="page-title">Book an Appointment</h1>
        <p class="page-subtitle">Select a provider, service, and time that works for you</p>
      </div>

      <!-- Step indicator -->
      <div class="steps-bar">
        @for (step of steps; track step.num; let last = $last) {
          <div class="step" [class.is-active]="currentStep() >= step.num" [class.is-current]="currentStep() === step.num">
            <span class="step-num">
              @if (currentStep() > step.num) {
                <span class="material-icons-outlined">check</span>
              } @else {
                {{ step.num }}
              }
            </span>
            <span class="step-label">{{ step.label }}</span>
          </div>
          @if (!last) {
            <div class="step-line" [class.is-active]="currentStep() > step.num"></div>
          }
        }
      </div>

      <!-- Step 1: Provider -->
      @if (currentStep() === 1) {
        <div class="step-content">
          <h2 class="section-title">Select a Provider</h2>
          <div class="providers-grid">
            @for (provider of providers(); track provider.id) {
              <div
                class="selectable-card"
                [class.is-selected]="selectedProvider()?.id === provider.id"
                (click)="selectProvider(provider)"
              >
                <app-avatar
                  [src]="provider.avatar ?? undefined"
                  [name]="provider.business_name"
                  size="lg"
                />
                <div class="card-info">
                  <h3 class="card-title">{{ provider.business_name }}</h3>
                  <p class="card-subtitle">{{ provider.business_type }}</p>
                  <div class="card-rating">
                    <span class="material-icons-outlined star">star</span>
                    <span>{{ provider.rating }}</span>
                  </div>
                </div>
                @if (selectedProvider()?.id === provider.id) {
                  <span class="check-icon"><span class="material-icons-outlined">check_circle</span></span>
                }
              </div>
            }
          </div>
          <div class="step-actions">
            <app-button variant="primary" [disabled]="!selectedProvider()" (onClick)="nextStep()">
              Continue
              <span class="material-icons-outlined">arrow_forward</span>
            </app-button>
          </div>
        </div>
      }

      <!-- Step 2: Service -->
      @if (currentStep() === 2) {
        <div class="step-content">
          <h2 class="section-title">Select a Service</h2>
          <div class="services-grid">
            @for (service of services(); track service.id) {
              <div
                class="service-selectable"
                [class.is-selected]="selectedService()?.id === service.id"
                (click)="selectService(service)"
              >
                <div class="service-info">
                  <h3 class="service-name">{{ service.name }}</h3>
                  <p class="service-desc">{{ service.description }}</p>
                  <div class="service-meta">
                    <span class="meta-item">
                      <span class="material-icons-outlined">schedule</span>
                      {{ service.duration_minutes }} min
                    </span>
                    <span class="service-price">$ {{ service.price }}</span>
                  </div>
                </div>
                @if (selectedService()?.id === service.id) {
                  <span class="check-icon"><span class="material-icons-outlined">check_circle</span></span>
                }
              </div>
            }
          </div>
          <div class="step-actions">
            <app-button variant="outline" (onClick)="prevStep()">
              <span class="material-icons-outlined">arrow_back</span>
              Back
            </app-button>
            <app-button variant="primary" [disabled]="!selectedService()" (onClick)="nextStep()">
              Continue
              <span class="material-icons-outlined">arrow_forward</span>
            </app-button>
          </div>
        </div>
      }

      <!-- Step 3: Date & Time -->
      @if (currentStep() === 3) {
        <div class="step-content">
          <h2 class="section-title">Select Date & Time</h2>
          <div class="datetime-grid">
            <div class="calendar-section">
              <app-booking-calendar
                [selectedDate]="selectedDate()"
                [availableDates]="availableDates()"
                (dateChange)="onDateChange($event)"
              />
            </div>

            <div class="slots-section">
              <app-time-slot-selector
                [slots]="timeSlots()"
                [selectedTime]="selectedTime()"
                (timeChange)="onTimeChange($event)"
              />
            </div>
          </div>
          <div class="step-actions">
            <app-button variant="outline" (onClick)="prevStep()">
              <span class="material-icons-outlined">arrow_back</span>
              Back
            </app-button>
            <app-button variant="primary" [disabled]="!selectedDate() || !selectedTime()" (onClick)="nextStep()">
              Continue
              <span class="material-icons-outlined">arrow_forward</span>
            </app-button>
          </div>
        </div>
      }

      <!-- Step 4: Confirm -->
      @if (currentStep() === 4) {
        <div class="step-content">
          <h2 class="section-title">Confirm Your Booking</h2>
          <div class="confirm-grid">
            <div class="confirm-card">
              <div class="confirm-row">
                <span class="material-icons-outlined confirm-icon">business</span>
                <div class="confirm-info">
                  <p class="confirm-label">Provider</p>
                  <p class="confirm-value">{{ selectedProvider()?.business_name }}</p>
                </div>
              </div>
              <div class="confirm-row">
                <span class="material-icons-outlined confirm-icon">spa</span>
                <div class="confirm-info">
                  <p class="confirm-label">Service</p>
                  <p class="confirm-value">{{ selectedService()?.name }}</p>
                </div>
              </div>
              <div class="confirm-row">
                <span class="material-icons-outlined confirm-icon">event</span>
                <div class="confirm-info">
                  <p class="confirm-label">Date</p>
                  <p class="confirm-value">{{ formattedDate() }}</p>
                </div>
              </div>
              <div class="confirm-row">
                <span class="material-icons-outlined confirm-icon">schedule</span>
                <div class="confirm-info">
                  <p class="confirm-label">Time</p>
                  <p class="confirm-value">{{ formattedTime() }}</p>
                </div>
              </div>
              <div class="confirm-row">
                <span class="material-icons-outlined confirm-icon">timer</span>
                <div class="confirm-info">
                  <p class="confirm-label">Duration</p>
                  <p class="confirm-value">{{ selectedService()?.duration_minutes }} minutes</p>
                </div>
              </div>
            </div>

            <div class="price-card">
              <h3 class="price-title">Payment Summary</h3>
              <div class="price-row">
                <span class="price-label">Service Price</span>
                <span class="price-value">$ {{ selectedService()?.price }}</span>
              </div>
              <div class="price-row">
                <span class="price-label">Booking Fee</span>
                <span class="price-value">Free</span>
              </div>
              <div class="price-divider"></div>
              <div class="price-row price-total">
                <span class="price-label">Total</span>
                <span class="price-value">$ {{ selectedService()?.price }}</span>
              </div>
            </div>
          </div>

          <div class="step-actions">
            <app-button variant="outline" (onClick)="prevStep()">
              <span class="material-icons-outlined">arrow_back</span>
              Back
            </app-button>
            <app-button variant="primary" (onClick)="confirmBooking()">
              <span class="material-icons-outlined">check_circle</span>
              Confirm Booking
            </app-button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .booking-page {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .page-header { margin-bottom: var(--space-2); }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    /* Steps */
    .steps-bar {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .step {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--gray-400);
      transition: color var(--transition-fast);
    }

    .step.is-active { color: var(--primary-600); }
    :host-context(.dark) .step.is-active { color: var(--primary-400); }

    .step-num {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      background: var(--gray-100);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .step-num { background: var(--gray-700); }

    .step.is-active .step-num {
      background: var(--primary-500);
      color: #fff;
    }

    .step.is-current .step-num {
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    :host-context(.dark) .step.is-current .step-num {
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    .step-num .material-icons-outlined { font-size: 1rem; }

    .step-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .step-line {
      flex: 1;
      height: 2px;
      background: var(--gray-200);
      transition: background var(--transition-fast);
      max-width: 40px;
    }

    :host-context(.dark) .step-line { background: var(--gray-700); }
    .step-line.is-active { background: var(--primary-500); }

    @media (max-width: 639px) {
      .step-label { display: none; }
      .step-line { max-width: 20px; }
    }

    /* Content */
    .step-content {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      padding: var(--space-6);
    }

    :host-context(.dark) .step-content {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-5);
    }

    /* Provider cards */
    .providers-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }

    @media (min-width: 640px) {
      .providers-grid { grid-template-columns: 1fr 1fr; }
    }

    .selectable-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--gray-50);
      border: 2px solid transparent;
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover { border-color: var(--gray-300); }

      &.is-selected {
        border-color: var(--primary-500);
        background: var(--primary-50);
      }
    }

    :host-context(.dark) .selectable-card {
      background: var(--gray-900);

      &:hover { border-color: var(--gray-600); }

      &.is-selected {
        border-color: var(--primary-500);
        background: rgba(79, 70, 229, 0.1);
      }
    }

    .card-info { flex: 1; min-width: 0; }

    .card-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .card-subtitle {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .card-rating {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin-top: var(--space-1);
    }

    .card-rating .star { color: var(--warning-500); font-size: 0.875rem; }

    .check-icon {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
      color: var(--primary-500);
    }

    .check-icon .material-icons-outlined { font-size: 1.25rem; }

    /* Service cards */
    .services-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }

    .service-selectable {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-4);
      background: var(--gray-50);
      border: 2px solid transparent;
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover { border-color: var(--gray-300); }

      &.is-selected {
        border-color: var(--primary-500);
        background: var(--primary-50);
      }
    }

    :host-context(.dark) .service-selectable {
      background: var(--gray-900);

      &:hover { border-color: var(--gray-600); }

      &.is-selected {
        border-color: var(--primary-500);
        background: rgba(79, 70, 229, 0.1);
      }
    }

    .service-info { flex: 1; }

    .service-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
    }

    .service-desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--space-2);
      line-height: 1.5;
    }

    .service-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .meta-item .material-icons-outlined { font-size: 0.875rem; }

    .service-price {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
    }

    :host-context(.dark) .service-price { color: var(--primary-400); }

    /* Date & Time */
    .datetime-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-5);
      margin-bottom: var(--space-5);
    }

    @media (min-width: 768px) {
      .datetime-grid { grid-template-columns: 1fr 1fr; }
    }

    /* Confirm */
    .confirm-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
      margin-bottom: var(--space-5);
    }

    @media (min-width: 768px) {
      .confirm-grid { grid-template-columns: 2fr 1fr; }
    }

    .confirm-card, .price-card {
      padding: var(--space-5);
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .confirm-card,
    :host-context(.dark) .price-card {
      background: var(--gray-900);
      border-color: var(--gray-700);
    }

    .confirm-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) 0;
    }

    .confirm-icon {
      color: var(--primary-500);
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .confirm-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }

    .confirm-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0;
    }

    .price-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      padding: var(--space-2) 0;
    }

    .price-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .price-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .price-divider {
      height: 1px;
      background: var(--border);
      margin: var(--space-2) 0;
    }

    :host-context(.dark) .price-divider { background: var(--gray-700); }

    .price-total .price-label, .price-total .price-value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
    }

    :host-context(.dark) .price-total .price-label,
    :host-context(.dark) .price-total .price-value { color: var(--primary-400); }

    /* Actions */
    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border);
    }

    :host-context(.dark) .step-actions { border-color: var(--gray-700); }
  `],
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
