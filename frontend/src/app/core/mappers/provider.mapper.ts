import { BackendUser, mapBackendUser } from './user.mapper';
import { BackendProviderProfile } from '../models/provider.model';
import { ProfileImage, ProviderProfile, Review, Service, User } from '../models/user.model';

export function mapBackendProviderProfile(profile: BackendProviderProfile): ProviderProfile {
  const now = new Date().toISOString();
  const userId = typeof profile.user === 'string' ? profile.user : profile.user?._id || profile.user?.id || '';

  return {
    _id: profile._id || profile.id || '',
    user: userId,
    businessName: profile.businessName || '',
    bio: profile.bio || '',
    category: profile.category || '',
    address: profile.address || '',
    city: profile.city || '',
    profileImage: mapProfileImage(profile.profileImage),
    timezone: profile.timezone || 'UTC',
    ratingAverage: profile.ratingAverage ?? 0,
    ratingCount: profile.ratingCount ?? 0,
    isVerified: profile.isVerified ?? false,
    deletedAt: normalizeDeletedAt(profile.deletedAt),
    createdAt: profile.createdAt || now,
    updatedAt: profile.updatedAt || now,
  };
}

export interface MappedPublicProvider {
  user: User;
  profile: ProviderProfile;
  services: Service[];
  reviews: Review[];
}

export function mapBackendProviderToPublicProvider(
  profile: BackendProviderProfile,
  services: Service[] = []
): MappedPublicProvider {
  const mappedProfile = mapBackendProviderProfile(profile);
  const user = mapProviderUser(profile, mappedProfile);

  return {
    user,
    profile: mappedProfile,
    services,
    reviews: [],
  };
}

function mapProviderUser(profile: BackendProviderProfile, mappedProfile: ProviderProfile): User {
  if (profile.user && typeof profile.user !== 'string') {
    return mapBackendUser(profile.user as BackendUser);
  }

  const now = new Date().toISOString();

  return {
    _id: mappedProfile.user,
    name: mappedProfile.businessName || 'Provider',
    email: '',
    role: 'provider',
    authProvider: 'local',
    avatar: mappedProfile.profileImage.url || undefined,
    isActive: true,
    deletedAt: null,
    createdAt: mappedProfile.createdAt || now,
    updatedAt: mappedProfile.updatedAt || now,
  };
}

function mapProfileImage(image?: BackendProviderProfile['profileImage']): ProfileImage {
  if (typeof image === 'string') {
    return createProfileImage(image);
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
}

function createProfileImage(url: string): ProfileImage {
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
