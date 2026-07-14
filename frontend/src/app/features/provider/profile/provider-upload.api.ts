import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { API_ENDPOINTS } from '../../../core/api/endpoints';
import { ProfileImage, ServiceImage } from '../../../core/models/user.model';

interface UploadResponseBody {
  data?: unknown;
  profileImage?: ProfileImage;
  images?: ServiceImage[];
}

@Injectable({ providedIn: 'root' })
export class ProviderUploadApi {
  private api = inject(ApiService);

  async uploadProviderProfileImage(file: File): Promise<ProfileImage> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await firstValueFrom(
      this.api.patch<unknown>(API_ENDPOINTS.uploads.providerProfileImage, formData)
    );

    const body = this.payload(response);
    const profileImage = body.profileImage || body;

    if (!profileImage) {
      throw new Error('Uploaded profile image was not returned by the server.');
    }

    return profileImage as ProfileImage;
  }

  async uploadServiceImages(serviceId: string, files: File[]): Promise<ServiceImage[]> {
    const formData = new FormData();
    files.slice(0, 5).forEach((file) => formData.append('images', file));

    const response = await firstValueFrom(
      this.api.post<unknown>(API_ENDPOINTS.uploads.serviceImages(serviceId), formData)
    );

    return this.extractImages(response);
  }

  async deleteServiceImage(serviceId: string, publicId: string): Promise<ServiceImage[]> {
    const response = await firstValueFrom(
      this.api.delete<unknown>(API_ENDPOINTS.uploads.serviceImages(serviceId), { body: { publicId } })
    );

    return this.extractImages(response);
  }

  private extractImages(response: unknown): ServiceImage[] {
    const body = this.payload(response);
    const images = body.images || body;
    return Array.isArray(images) ? images as ServiceImage[] : [];
  }

  private payload(response: unknown): UploadResponseBody {
    const body = response as UploadResponseBody;
    return (body?.data as UploadResponseBody) || body;
  }
}
