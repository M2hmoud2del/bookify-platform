import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { ProviderProfileApi } from './provider-profile.api';

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, CardComponent, InputComponent, AvatarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProviderProfileComponent {
  private router = inject(Router);
  private providerProfileApi = inject(ProviderProfileApi);
  authService = inject(AuthService);

  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  profileImageUrl = signal<string | undefined>(undefined);

  business = {
    businessName: '',
    bio: '',
    category: '',
    address: '',
    city: '',
    timezone: 'UTC',
  };

  avatarName = computed(() => this.business.businessName || this.authService.user()?.name || 'Business');

  constructor() {
    void this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const profile = await this.providerProfileApi.getMyProviderProfile();

      this.business = {
        businessName: profile.businessName,
        bio: profile.bio ?? '',
        category: profile.category ?? '',
        address: profile.address ?? '',
        city: profile.city ?? '',
        timezone: profile.timezone || 'UTC',
      };
      this.profileImageUrl.set(profile.profileImage?.url || undefined);
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }

  async onSave(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    try {
      const profile = await this.providerProfileApi.updateMyProviderProfile(this.business);
      this.profileImageUrl.set(profile.profileImage?.url || undefined);
      this.router.navigate(['/provider/dashboard']);
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.saving.set(false);
    }
  }

  private errorMessage(err: unknown): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : 'Unable to save provider profile.');
  }
}
