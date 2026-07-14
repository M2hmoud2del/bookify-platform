import { BackendUser } from '../mappers/user.mapper';
import { Service, ServiceImage } from './user.model';

export interface BackendService {
  _id?: string;
  id?: string;
  provider?: string | BackendUser;
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  durationMinutes?: number;
  duration_minutes?: number;
  images?: Array<string | Partial<ServiceImage>>;
  isActive?: boolean;
  is_active?: boolean;
  deletedAt?: Date | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicePayload {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  durationMinutes?: number;
  images?: Array<string | Partial<ServiceImage>>;
  isActive?: boolean;
}

export interface ServiceFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type ServiceView = Service;
