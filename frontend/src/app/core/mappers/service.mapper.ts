import { BackendService } from '../models/service.model';
import { Service, ServiceImage } from '../models/user.model';

export function mapBackendService(service: BackendService): Service {
  const now = new Date().toISOString();

  return {
    _id: service._id || service.id || '',
    provider: mapProviderId(service.provider),
    title: service.title || '',
    description: service.description || '',
    category: service.category || '',
    price: Number(service.price ?? 0),
    durationMinutes: Number(service.durationMinutes ?? service.duration_minutes ?? 1),
    images: mapServiceImages(service.images),
    isActive: service.isActive ?? service.is_active ?? true,
    deletedAt: normalizeDeletedAt(service.deletedAt),
    createdAt: service.createdAt || now,
    updatedAt: service.updatedAt || now,
  };
}

export function mapBackendServices(services: BackendService[] = []): Service[] {
  return services.map(mapBackendService);
}

function mapProviderId(provider?: BackendService['provider']): string {
  if (!provider) {
    return '';
  }

  return typeof provider === 'string' ? provider : provider._id || provider.id || '';
}

function mapServiceImages(images: BackendService['images'] = []): ServiceImage[] {
  return images.map((image) => {
    if (typeof image === 'string') {
      return createServiceImage(image);
    }

    return {
      url: image?.url || '',
      publicId: image?.publicId || '',
      width: image?.width ?? 0,
      height: image?.height ?? 0,
      format: image?.format || '',
      bytes: image?.bytes ?? 0,
      moderationStatus: image?.moderationStatus || 'approved',
    };
  });
}

function createServiceImage(url: string): ServiceImage {
  return {
    url,
    publicId: '',
    width: 0,
    height: 0,
    format: '',
    bytes: 0,
    moderationStatus: 'approved',
  };
}

function normalizeDeletedAt(value?: Date | string | null): Date | null {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
}
