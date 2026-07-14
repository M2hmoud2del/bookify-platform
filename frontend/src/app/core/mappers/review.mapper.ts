import { BackendUser, mapBackendUser } from './user.mapper';
import { mapBackendAppointment } from './appointment.mapper';
import { mapBackendService } from './service.mapper';
import { BackendAppointment } from '../models/appointment.model';
import { BackendReview, ReviewView } from '../models/review.model';
import { BackendService } from '../models/service.model';
import { Service, User } from '../models/user.model';

export function mapBackendReview(review: BackendReview): ReviewView {
  const now = new Date().toISOString();

  return {
    _id: review._id || review.id || '',
    appointment: mapReviewAppointment(review.appointment),
    customer: mapReviewUser(review.customer, 'customer'),
    provider: mapReviewUser(review.provider, 'provider'),
    service: mapReviewService(review.service),
    rating: normalizeRating(review.rating),
    comment: review.comment || '',
    createdAt: review.createdAt || now,
    updatedAt: review.updatedAt || now,
  };
}

export function mapBackendReviews(reviews: BackendReview[] = []): ReviewView[] {
  return reviews.map(mapBackendReview);
}

function mapReviewAppointment(value?: string | BackendAppointment): ReviewView['appointment'] {
  if (value && typeof value !== 'string') {
    return mapBackendAppointment(value);
  }

  return typeof value === 'string' ? value : '';
}

function mapReviewUser(value: BackendReview['customer'] | BackendReview['provider'], role: User['role']): User {
  if (value && typeof value !== 'string') {
    return mapBackendUser({ ...value, role: value.role || role } as BackendUser);
  }

  const now = new Date().toISOString();
  return {
    _id: typeof value === 'string' ? value : '',
    name: role === 'provider' ? 'Provider' : 'Customer',
    email: '',
    role,
    authProvider: 'local',
    isActive: true,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function mapReviewService(value?: string | BackendService): Service {
  if (value && typeof value !== 'string') {
    return mapBackendService(value);
  }

  const now = new Date().toISOString();
  return {
    _id: typeof value === 'string' ? value : '',
    provider: '',
    title: 'Service',
    description: '',
    category: '',
    price: 0,
    durationMinutes: 1,
    images: [],
    isActive: true,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeRating(value?: number): number {
  const rating = Number(value ?? 0);
  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.min(5, Math.max(0, rating));
}
