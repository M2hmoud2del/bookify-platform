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
import { ProviderUploadApi } from './provider-upload.api';

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
  private providerUploadApi = inject(ProviderUploadApi);
  authService = inject(AuthService);

  loading = signal(false);
  saving = signal(false);
  uploadingImage = signal(false);
  error = signal<string | null>(null);
  uploadError = signal<string | null>(null);
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
      const msg = this.errorMessage(err, 'Unable to load provider profile.');
      if (!msg.toLowerCase().includes('not found')) {
        this.error.set(msg);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async onProfileImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.uploadError.set('Please select a valid image file.');
      return;
    }

    this.uploadingImage.set(true);
    this.uploadError.set(null);

    try {
      const image = await this.providerUploadApi.uploadProviderProfileImage(file);
      this.profileImageUrl.set(image.url || undefined);
      
      const currentUser = this.authService.user();
      if (currentUser && image.url) {
        this.authService.user.set({ ...currentUser, avatar: image.url });
      }
    } catch (err) {
      this.uploadError.set(this.errorMessage(err, 'Unable to upload provider profile image.'));
    } finally {
      this.uploadingImage.set(false);
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
      this.error.set(this.errorMessage(err, 'Unable to save provider profile.'));
    } finally {
      this.saving.set(false);
    }
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
