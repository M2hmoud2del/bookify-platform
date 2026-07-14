import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicNavbarComponent } from '../../../layouts/public-layout/public-navbar.component';
import { FooterComponent } from '../../../layouts/public-layout/footer.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ProviderHeaderComponent } from '../shared/provider-header.component';
import { ProviderAboutComponent } from '../shared/provider-about.component';
import { ServiceListComponent } from '../shared/service-list.component';
import { PublicProvider } from '../shared/public.models';
import { ProviderProfileApi } from '../../provider/profile/provider-profile.api';
import { ProviderServicesApi } from '../../provider/services/provider-services.api';
import { ReviewView } from '../../../core/models/review.model';
import { Service } from '../../../core/models/user.model';
import { ReviewsApi } from '../../customer/reviews/reviews.api';

@Component({
  selector: 'app-provider-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PublicNavbarComponent,
    FooterComponent,
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
  private providerProfileApi = inject(ProviderProfileApi);
  private providerServicesApi = inject(ProviderServicesApi);
  private reviewsApi = inject(ReviewsApi);
  router = inject(Router);

  provider = signal<PublicProvider | undefined>(undefined);
  providerReviews = signal<ReviewView[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<'services' | 'about' | 'reviews'>('services');

  providerId = computed(() => this.provider()?.profile._id || this.route.snapshot.paramMap.get('id') || '');

  constructor() {
    void this.loadProvider();
  }

  async loadProvider(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const provider = await this.providerProfileApi.getProviderById(id);
      const [services, reviewResult] = await Promise.all([
        this.providerServicesApi.getProviderServices(provider.profile._id),
        this.reviewsApi.getProviderReviews(provider.user._id),
      ]);
      this.providerReviews.set(reviewResult.reviews);
      this.provider.set({
        ...provider,
        profile: {
          ...provider.profile,
          ratingAverage: reviewResult.averageRating,
          ratingCount: reviewResult.totalReviews,
        },
        services,
      } as PublicProvider);
    } catch (err) {
      this.error.set(this.errorMessage(err));
      this.provider.set(undefined);
      this.providerReviews.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  toggleFavorite(): void {
    // Favorite state is not connected in this migration step.
  }

  scrollToServices(): void {
    this.activeTab.set('services');
    setTimeout(() => {
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  onBookService(service: Service): void {
    const p = this.provider();
    if (p) {
      this.router.navigate(['/providers', p.profile._id, 'services', service._id]);
    }
  }

  serviceName(serviceId: string): string {
    const p = this.provider();
    if (!p) return serviceId;
    return p.services.find(s => s._id === serviceId)?.title ?? serviceId;
  }

  private errorMessage(err: unknown): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : 'Unable to load provider.');
  }
}
