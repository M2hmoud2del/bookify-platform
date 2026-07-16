import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { UploadAreaComponent } from '../shared/upload-area.component';
import { ProfileImage, Service, ServiceImage } from '../../../core/models/user.model';
import { ProviderProfileApi } from './provider-profile.api';
import { ProviderUploadApi } from './provider-upload.api';
import { ProviderServicesApi } from '../services/provider-services.api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-upload-images',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent, UploadAreaComponent],
  templateUrl: './upload-images.component.html',
  styleUrl: './upload-images.component.css',
})
export class UploadImagesComponent {
  private providerProfileApi = inject(ProviderProfileApi);
  private providerUploadApi = inject(ProviderUploadApi);
  private providerServicesApi = inject(ProviderServicesApi);
  private authService = inject(AuthService);

  profileImage = signal<ProfileImage | null>(null);
  services = signal<Service[]>([]);
  serviceImages = signal<Record<string, ServiceImage[]>>({});
  loading = signal(false);
  uploadingProfile = signal(false);
  uploadingServiceId = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor() {
    void this.loadImages();
  }

  async loadImages(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const profile = await this.providerProfileApi.getMyProviderProfile();
      const services = await this.providerServicesApi.getProviderServices(profile._id);
      this.profileImage.set(profile.profileImage?.url ? profile.profileImage : null);
      this.services.set(services);
      this.serviceImages.set(Object.fromEntries(services.map((service) => [service._id, service.images || []])));
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load images.'));
    } finally {
      this.loading.set(false);
    }
  }

  getServiceImages(serviceId: string): ServiceImage[] {
    return this.serviceImages()[serviceId] ?? [];
  }

  async onProfileFilesSelected(files: File[]): Promise<void> {
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      this.error.set('Please select a valid image file.');
      return;
    }

    this.uploadingProfile.set(true);
    this.error.set(null);

    try {
      const image = await this.providerUploadApi.uploadProviderProfileImage(file);
      this.profileImage.set(image);

      const currentUser = this.authService.user();
      if (currentUser && image.url) {
        this.authService.user.set({ ...currentUser, avatar: image.url });
      }
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to upload profile image.'));
    } finally {
      this.uploadingProfile.set(false);
    }
  }

  async onProfileFileInputChanged(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    await this.onProfileFilesSelected(Array.from(input.files ?? []));
    input.value = '';
  }

  removeProfileImage(): void {
    this.profileImage.set(null);
  }

  async onServiceFilesSelected(files: File[], serviceId: string): Promise<void> {
    const imageFiles = files.filter((file) => file.type.startsWith('image/')).slice(0, 5);

    if (imageFiles.length === 0) {
      this.error.set('Please select valid image files.');
      return;
    }

    this.uploadingServiceId.set(serviceId);
    this.error.set(null);

    try {
      const images = await this.providerUploadApi.uploadServiceImages(serviceId, imageFiles);
      this.serviceImages.update((map) => ({ ...map, [serviceId]: images }));
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to upload service images.'));
    } finally {
      this.uploadingServiceId.set(null);
    }
  }

  async removeServiceImage(serviceId: string, publicId: string): Promise<void> {
    this.error.set(null);

    try {
      const images = await this.providerUploadApi.deleteServiceImage(serviceId, publicId);
      this.serviceImages.update((map) => ({ ...map, [serviceId]: images }));
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to remove service image.'));
    }
  }

  save(): void {
    // Uploads are persisted immediately by the backend upload endpoints.
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
