import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PublicNavbarComponent } from '../../../layouts/public-layout/public-navbar.component';
import { FooterComponent } from '../../../layouts/public-layout/footer.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { getProviderById, getServiceById, PublicProvider } from '../shared/public.models';
import { Service } from '../../../core/models/user.model';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PublicNavbarComponent,
    FooterComponent,
    ButtonComponent,
    AvatarComponent,
    RatingComponent,
    BadgeComponent,
    EmptyStateComponent,
  ],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css',
})
export class ServiceDetailsComponent {
  private route = inject(ActivatedRoute);
  router = inject(Router);

  provider = computed<PublicProvider | undefined>(() => {
    const id = this.route.snapshot.paramMap.get('providerId');
    return id ? getProviderById(id) : undefined;
  });

  service = computed<Service | undefined>(() => {
    const providerId = this.route.snapshot.paramMap.get('providerId');
    const serviceId = this.route.snapshot.paramMap.get('serviceId');
    if (!providerId || !serviceId) return undefined;
    return getServiceById(providerId, serviceId);
  });

  serviceReviews = computed(() => {
    const p = this.provider();
    const s = this.service();
    if (!p || !s) return [];
    return p.reviews.filter(r => r.service === s._id);
  });

  includedItems = computed(() => {
    const s = this.service();
    if (!s) return [];
    return [
      `Professional ${s.title.toLowerCase()} service`,
      `Full ${s.durationMinutes}-minute session`,
      'All necessary equipment and materials',
      'Expert consultation and advice',
      'Satisfaction guarantee',
    ];
  });

  timelineSteps = [
    { step: 1, title: 'Book Your Slot', description: 'Choose a date and time that works for you from the available slots.' },
    { step: 2, title: 'Confirm Payment', description: 'Securely complete your booking with online payment.' },
    { step: 3, title: 'Attend Your Appointment', description: 'Arrive at the provider\'s location or join online for your session.' },
    { step: 4, title: 'Share Your Experience', description: 'After your appointment, leave a review to help others.' },
  ];

  onBook(): void {
    const p = this.provider();
    if (p) {
      this.router.navigate(['/providers', p.user._id, 'services', this.service()?._id]);
    }
  }
}
