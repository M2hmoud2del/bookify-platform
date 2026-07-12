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
  template: `
    <div class="upload-page">
      <div class="page-header">
        <a routerLink="/provider/profile" class="back-link">
          <span class="material-icons-outlined">arrow_back</span>
          Back to Profile
        </a>
        <h1 class="page-title">Manage Images</h1>
        <p class="page-subtitle">Manage your profile image and service images</p>
      </div>

      <!-- Profile Image -->
      <app-card title="Profile Image">
        <div card-header>
          <span class="card-hint">Your profile image appears on your profile and booking page</span>
        </div>
        @if (profileImage()) {
          <div class="profile-preview">
            <img [src]="profileImage()!.url" alt="Profile" />
            <div class="profile-actions">
              <app-button variant="outline" size="sm">
                <span class="material-icons-outlined">swap_horiz</span>
                Replace
              </app-button>
              <app-button variant="ghost" size="sm" (onClick)="removeProfileImage()">
                <span class="material-icons-outlined">delete</span>
                Remove
              </app-button>
            </div>
          </div>
        } @else {
          <app-upload-area
            title="Upload Profile Image"
            description="Recommended size: 400x400px"
            [multiple]="false"
            icon="store"
            (filesSelected)="onProfileFilesSelected($event)"
          />
        }
      </app-card>

      <!-- Service Images -->
      @for (service of services(); track service._id) {
        <app-card [title]="'Images: ' + service.title">
          <div card-header>
            <span class="card-hint">Images for this service (up to 8 images)</span>
          </div>

          @if (getServiceImages(service._id).length > 0) {
            <div class="gallery-grid">
              @for (img of getServiceImages(service._id); track img.publicId) {
                <div class="gallery-item">
                  <img [src]="img.url" alt="Service image" loading="lazy" />
                  <div class="gallery-overlay">
                    <button
                      type="button"
                      class="remove-btn"
                      (click)="removeServiceImage(service._id, img.publicId)"
                      title="Remove"
                    >
                      <span class="material-icons-outlined">delete</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          }

          @if (getServiceImages(service._id).length < 8) {
            <div class="upload-section">
              <app-upload-area
                title="Add Service Images"
                description="Click to browse or drag and drop"
                [multiple]="true"
                icon="add_photo_alternate"
                (filesSelected)="onServiceFilesSelected($event, service._id)"
              />
            </div>
          }
        </app-card>
      }

      <!-- Save -->
      <div class="save-bar">
        <app-button variant="primary" (onClick)="save()">
          <span class="material-icons-outlined">save</span>
          Save All Changes
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .upload-page {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .back-link:hover { color: var(--primary-500); }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .card-hint {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .profile-preview {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .profile-preview img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: var(--radius-xl);
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    @media (min-width: 480px) {
      .gallery-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (min-width: 768px) {
      .gallery-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .gallery-item {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      aspect-ratio: 1;
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .gallery-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    .gallery-item:hover .gallery-overlay { opacity: 1; }

    .remove-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(239, 68, 68, 0.9);
      color: #fff;
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .remove-btn:hover { background: rgba(239, 68, 68, 1); }
    .remove-btn .material-icons-outlined { font-size: 1.25rem; }

    .upload-section { margin-top: var(--space-3); }

    .save-bar {
      display: flex;
      justify-content: flex-end;
      padding-top: var(--space-2);
    }
  `],
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
