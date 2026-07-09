import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-booking-customer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, CardComponent, AvatarComponent, BadgeComponent],
  template: `
    <div class="booking-page">
      <div class="booking-header">
        <h1 class="page-title">Book an Appointment</h1>
        <p class="page-subtitle">Select a provider, service, and time that works for you.</p>
      </div>

      <div class="booking-steps">
        <div class="step" [ngClass]="{ 'is-active': currentStep() >= 1 }">
          <span class="step-number">1</span>
          <span class="step-label">Provider</span>
        </div>
        <div class="step-line"></div>
        <div class="step" [ngClass]="{ 'is-active': currentStep() >= 2 }">
          <span class="step-number">2</span>
          <span class="step-label">Service</span>
        </div>
        <div class="step-line"></div>
        <div class="step" [ngClass]="{ 'is-active': currentStep() >= 3 }">
          <span class="step-number">3</span>
          <span class="step-label">Date & Time</span>
        </div>
        <div class="step-line"></div>
        <div class="step" [ngClass]="{ 'is-active': currentStep() >= 4 }">
          <span class="step-number">4</span>
          <span class="step-label">Confirm</span>
        </div>
      </div>

      @if (currentStep() === 1) {
        <div class="booking-content">
          <h2 class="section-title">Select a Provider</h2>
          <div class="providers-grid">
            @for (provider of providers(); track provider.id) {
              <div class="provider-card" [ngClass]="{ 'is-selected': selectedProvider()?.id === provider.id }" (click)="selectedProvider.set(provider)">
                <app-avatar [name]="provider.business_name" size="lg" />
                <div class="provider-info">
                  <h3 class="provider-name">{{ provider.business_name }}</h3>
                  <p class="provider-type">{{ provider.business_type }}</p>
                  <div class="provider-rating">
                    <span class="material-icons-outlined star">star</span>
                    <span>{{ provider.rating }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
          <div class="booking-actions">
            <app-button variant="primary" [disabled]="!selectedProvider()" (onClick)="nextStep()">Continue</app-button>
          </div>
        </div>
      }

      @if (currentStep() === 2) {
        <div class="booking-content">
          <button class="back-btn" (click)="prevStep()">
            <span class="material-icons-outlined">arrow_back</span> Back
          </button>
          <h2 class="section-title">Select a Service</h2>
          <div class="services-grid">
            @for (service of services(); track service.id) {
              <div class="service-card" [ngClass]="{ 'is-selected': selectedService()?.id === service.id }" (click)="selectedService.set(service)">
                <h3 class="service-name">{{ service.name }}</h3>
                <p class="service-description">{{ service.description }}</p>
                <div class="service-meta">
                  <span>{{ service.duration_minutes }} min</span>
                  <span class="price">{{ service.price | currency }}</span>
                </div>
              </div>
            }
          </div>
          <div class="booking-actions">
            <app-button variant="outline" (onClick)="prevStep()">Back</app-button>
            <app-button variant="primary" [disabled]="!selectedService()" (onClick)="nextStep()">Continue</app-button>
          </div>
        </div>
      }

      @if (currentStep() === 3) {
        <div class="booking-content">
          <button class="back-btn" (click)="prevStep()">
            <span class="material-icons-outlined">arrow_back</span> Back
          </button>
          <h2 class="section-title">Select Date & Time</h2>
          <div class="datetime-section">
            <p>Calendar and time slot selection will appear here</p>
          </div>
          <div class="booking-actions">
            <app-button variant="outline" (onClick)="prevStep()">Back</app-button>
            <app-button variant="primary" (onClick)="nextStep()">Continue</app-button>
          </div>
        </div>
      }

      @if (currentStep() === 4) {
        <div class="booking-content">
          <button class="back-btn" (click)="prevStep()">
            <span class="material-icons-outlined">arrow_back</span> Back
          </button>
          <h2 class="section-title">Confirm Booking</h2>
          <div class="summary">
            <p><strong>Provider:</strong> {{ selectedProvider()?.business_name }}</p>
            <p><strong>Service:</strong> {{ selectedService()?.name }}</p>
            <p><strong>Total:</strong> {{ selectedService()?.price | currency }}</p>
          </div>
          <div class="booking-actions">
            <app-button variant="primary" (onClick)="confirmBooking()">Confirm Booking</app-button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .booking-page { max-width: 800px; margin: 0 auto; }
    .booking-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 600; margin: 0; }
    .page-subtitle { color: #64748b; margin: 0.5rem 0 0; }
    .booking-steps { display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
    .step { display: flex; align-items: center; gap: 0.5rem; color: #94a3b8; }
    .step.is-active { color: #4F46E5; }
    .step-number { width: 24px; height: 24px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }
    .step.is-active .step-number { background: #4F46E5; color: white; }
    .step-label { font-size: 0.875rem; }
    .step-line { width: 2rem; height: 2px; background: #e2e8f0; margin: 0 0.5rem; }
    .booking-content { background: white; border-radius: 1rem; padding: 1.5rem; border: 1px solid #e2e8f0; }
    .back-btn { display: flex; align-items: center; gap: 0.25rem; color: #64748b; margin-bottom: 1rem; }
    .section-title { font-size: 1.125rem; font-weight: 600; margin: 0 0 1rem; }
    .providers-grid, .services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .provider-card, .service-card { padding: 1rem; background: #f8fafc; border: 2px solid transparent; border-radius: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 1rem; }
    .provider-card:hover, .service-card:hover { border-color: #cbd5e1; }
    .provider-card.is-selected, .service-card.is-selected { border-color: #4F46E5; background: #eef2ff; }
    .provider-info, .service-info { flex: 1; }
    .provider-name, .service-name { font-size: 0.875rem; font-weight: 600; margin: 0; }
    .provider-type, .service-description { font-size: 0.75rem; color: #64748b; margin: 0.25rem 0 0; }
    .provider-rating { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; margin-top: 0.5rem; }
    .star { color: #f59e0b; }
    .service-meta { display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.75rem; }
    .price { color: #4F46E5; font-weight: 600; }
    .booking-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; margin-top: 1rem; }
    .datetime-section { padding: 2rem; text-align: center; color: #64748b; }
    .summary { padding: 1rem; background: #f8fafc; border-radius: 0.5rem; margin-bottom: 1rem; }
    .summary p { margin: 0.5rem 0; }
  `],
})
export class BookingComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  currentStep = signal(1);
  selectedProvider = signal<any>(null);
  selectedService = signal<any>(null);
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);

  providers = signal([
    { id: '1', business_name: 'Blossom Beauty Salon', business_type: 'Beauty Salon', rating: 4.9 },
    { id: '2', business_name: 'Dr. Michael Chen Dentistry', business_type: 'Dentist', rating: 4.8 },
    { id: '3', business_name: 'FitLife Training', business_type: 'Personal Trainer', rating: 4.7 },
  ]);

  services = signal([
    { id: '1', name: 'Haircut & Styling', description: 'Professional haircut and styling', duration_minutes: 45, price: 65 },
    { id: '2', name: 'Hair Coloring', description: 'Full hair coloring service', duration_minutes: 90, price: 120 },
    { id: '3', name: 'Beard Trim', description: 'Professional beard grooming', duration_minutes: 30, price: 35 },
    { id: '4', name: 'Facial Treatment', description: 'Rejuvenating facial', duration_minutes: 60, price: 85 },
  ]);

  nextStep(): void {
    this.currentStep.update(v => Math.min(v + 1, 4));
  }

  prevStep(): void {
    this.currentStep.update(v => Math.max(v - 1, 1));
  }

  confirmBooking(): void {
    this.router.navigate(['/checkout/success']);
  }
}
