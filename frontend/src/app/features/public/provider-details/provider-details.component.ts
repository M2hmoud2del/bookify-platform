import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PublicNavbarComponent } from '../../../layouts/public-layout/public-navbar.component';
import { FooterComponent } from '../../../layouts/public-layout/footer.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ProviderHeaderComponent } from '../shared/provider-header.component';
import { ProviderAboutComponent } from '../shared/provider-about.component';
import { ServiceListComponent } from '../shared/service-list.component';
import { getProviderById } from '../shared/public.models';

@Component({
  selector: 'app-provider-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PublicNavbarComponent,
    FooterComponent,
    ButtonComponent,
    AvatarComponent,
    RatingComponent,
    EmptyStateComponent,
    ProviderHeaderComponent,
    ProviderAboutComponent,
    ServiceListComponent,
  ],
  templateUrl: './provider-details.component.html',
  styleUrl: './provider-details.component.css',
})
export class ProviderDetailsComponent {
  private route = inject(ActivatedRoute);
  router = inject(Router);

  provider = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? getProviderById(id) : undefined;
  });

  activeTab = signal<'services' | 'about' | 'reviews'>('services');

  toggleFavorite(): void {
    // Favorite state is UI-only in this mock; no backend field to toggle.
  }

  scrollToServices(): void {
    this.activeTab.set('services');
    setTimeout(() => {
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  onBookService(service: any): void {
    const p = this.provider();
    if (p) {
      this.router.navigate(['/providers', p.user._id, 'services', service._id]);
    }
  }

  serviceName(serviceId: string): string {
    const p = this.provider();
    if (!p) return serviceId;
    return p.services.find(s => s._id === serviceId)?.title ?? serviceId;
  }
}
