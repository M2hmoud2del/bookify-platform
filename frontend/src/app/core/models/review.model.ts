import { BackendUser } from '../mappers/user.mapper';
import { BackendAppointment, AppointmentView } from './appointment.model';
import { BackendService } from './service.model';
import { Review, Service, User } from './user.model';

export interface BackendReview {
  _id?: string;
  id?: string;
  appointment?: string | BackendAppointment;
  customer?: string | BackendUser;
  provider?: string | BackendUser;
  service?: string | BackendService;
  rating?: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewPayload {
  appointmentId: string;
  rating: number;
  comment?: string;
}

export interface ReviewView extends Omit<Review, 'appointment' | 'customer' | 'provider' | 'service'> {
  appointment: string | AppointmentView;
  customer: User;
  provider: User;
  service: Service;
}

export interface ProviderReviewsResult {
  reviews: ReviewView[];
  averageRating: number;
  totalReviews: number;
}
