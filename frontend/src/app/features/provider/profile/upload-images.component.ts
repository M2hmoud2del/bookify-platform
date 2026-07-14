import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { UploadAreaComponent } from '../shared/upload-area.component';
import { MOCK_PROVIDER_PROFILE, MOCK_PROVIDER_SERVICES } from '../shared/provider.models';
import { ProfileImage, ServiceImage } from '../../../core/models/user.model';

@Component({
  selector: 'app-upload-images',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent, UploadAreaComponent],
  templateUrl: './upload-images.component.html',
  styleUrl: './upload-images.component.css',
})
export class UploadImagesComponent {
  profileImage = signal<ProfileImage | null>(MOCK_PROVIDER_PROFILE.profileImage);
  services = signal(MOCK_PROVIDER_SERVICES);
  serviceImages = signal<Record<string, ServiceImage[]>>(
    Object.fromEntries(MOCK_PROVIDER_SERVICES.map(s => [s._id, [...s.images]]))
  );

  getServiceImages(serviceId: string): ServiceImage[] {
    return this.serviceImages()[serviceId] ?? [];
  }

  onProfileFilesSelected(files: File[]): void {
    if (files.length === 0) return;
    const file = files[0];
    this.profileImage.set({
      url: URL.createObjectURL(file),
      publicId: `profile-${Date.now()}`,
      width: 400,
      height: 400,
      format: file.type.split('/')[1] ?? 'jpg',
      bytes: file.size,
      moderationStatus: 'pending_review',
    });
  }

  removeProfileImage(): void {
    this.profileImage.set(null);
  }

  onServiceFilesSelected(files: File[], serviceId: string): void {
    const newImages: ServiceImage[] = files.map((file, idx) => ({
      url: URL.createObjectURL(file),
      publicId: `img-${serviceId}-${Date.now()}-${idx}`,
      width: 400,
      height: 300,
      format: file.type.split('/')[1] ?? 'jpg',
      bytes: file.size,
      moderationStatus: 'pending_review',
    }));

    this.serviceImages.update(map => ({
      ...map,
      [serviceId]: [...(map[serviceId] ?? []), ...newImages],
    }));
  }

  removeServiceImage(serviceId: string, publicId: string): void {
    this.serviceImages.update(map => ({
      ...map,
      [serviceId]: (map[serviceId] ?? []).filter(img => img.publicId !== publicId),
    }));
  }

  save(): void {
    console.log('Saving profile image:', this.profileImage());
    console.log('Saving service images:', this.serviceImages());
  }
}
