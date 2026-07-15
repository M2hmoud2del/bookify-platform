import { User, UserRole } from '../models/user.model';

export interface BackendUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  authProvider?: string;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  isActive?: boolean;
  deletedAt?: Date | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function mapBackendUser(user: BackendUser): User {
  const email = user.email || '';
  const now = new Date().toISOString();

  return {
    _id: user._id || user.id || '',
    name: user.name || email.split('@')[0] || 'User',
    email,
    role: mapRole(user.role),
    authProvider: user.authProvider === 'google' ? 'google' : 'local',
    phone: user.phone,
    avatar: user.avatar || user.avatar_url,
    isActive: user.isActive ?? true,
    deletedAt: normalizeDeletedAt(user.deletedAt),
    createdAt: user.createdAt || now,
    updatedAt: user.updatedAt || now,
  };
}

function mapRole(role?: string): UserRole {
  if (role === 'provider') {
    return role;
  }

  return 'customer';
}

function normalizeDeletedAt(value?: Date | string | null): Date | null {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
}
