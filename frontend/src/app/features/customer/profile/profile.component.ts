import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ProfileHeaderComponent } from '../shared/profile-header.component';
import { MOCK_APPOINTMENTS, MOCK_REVIEWS } from '../shared/customer.models';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent, ProfileHeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class CustomerProfileComponent {
  authService = inject(AuthService);

  totalAppointments = computed(() => MOCK_APPOINTMENTS.length);
  completedAppointments = computed(() => MOCK_APPOINTMENTS.filter(a => a.status === 'completed').length);
  totalReviews = computed(() => MOCK_REVIEWS.length);

  displayName(): string {
    const user = this.authService.user();
    return user ? user.name : 'John Doe';
  }

  phone(): string {
    return '+1 (555) 123-4567';
  }

  memberSince(): string {
    return 'January 2026';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
