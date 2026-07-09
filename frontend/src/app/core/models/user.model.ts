export type UserRole = 'customer' | 'provider';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: BusinessType;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  website?: string;
  rating: number;
  total_reviews: number;
  total_appointments: number;
  monthly_revenue: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BusinessType =
  | 'doctor'
  | 'dentist'
  | 'photographer'
  | 'lawyer'
  | 'personal_trainer'
  | 'beauty_salon'
  | 'freelancer'
  | 'consultant'
  | 'other';

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  total_amount: number;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  customer?: User;
  provider?: ProviderProfile;
  service?: Service;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'refunded'
  | 'failed';

export interface Review {
  id: string;
  appointment_id: string;
  customer_id: string;
  provider_id: string;
  rating: number;
  comment?: string;
  response?: string;
  created_at: string;
  updated_at: string;
  customer?: User;
}

export interface WorkingHours {
  id: string;
  provider_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_working: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export type NotificationType =
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_reminder'
  | 'new_review'
  | 'payment_received'
  | 'schedule_change';

export interface Payment {
  id: string;
  user_id: string;
  appointment_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}
