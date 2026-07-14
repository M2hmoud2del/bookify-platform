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
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
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
