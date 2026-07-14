import { BackendUser } from '../mappers/user.mapper';
import { ProfileImage, ProviderProfile } from './user.model';

export interface BackendProviderProfile {
  _id?: string;
  id?: string;
  user?: string | BackendUser;
  businessName?: string;
  bio?: string;
  category?: string;
  address?: string;
  city?: string;
  profileImage?: string | Partial<ProfileImage> | null;
  timezone?: string;
  ratingAverage?: number;
  ratingCount?: number;
  isVerified?: boolean;
  deletedAt?: Date | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProviderProfilePayload {
  businessName?: string;
  bio?: string;
  category?: string;
  address?: string;
  city?: string;
  profileImage?: string | Partial<ProfileImage>;
  timezone?: string;
}

export interface ProviderFilters {
  search?: string;
  category?: string;
  city?: string;
}

export type ProviderProfileView = ProviderProfile;
