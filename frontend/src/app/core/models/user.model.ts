// ── User (matches backend Mongoose User schema) ──
export type UserRole = 'customer' | 'provider';
export type AuthProvider = 'local' | 'google';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
  googleId?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: string;
  updatedAt: string;
}

// ── ProviderProfile (matches backend Mongoose ProviderProfile schema) ──
export type ModerationStatus = 'pending_review' | 'approved' | 'rejected';

export interface ProfileImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  moderationStatus: ModerationStatus;
}

export interface ProviderProfile {
  _id: string;
  user: string; // ObjectId ref → User
  businessName: string;
  bio?: string;
  category?: string;
  address?: string;
  city?: string;
  profileImage: ProfileImage;
  timezone: string;
  ratingAverage: number;
  ratingCount: number;
  isVerified: boolean;
  deletedAt: Date | null;
  createdAt: string;
  updatedAt: string;
}

// ── Service (matches backend Mongoose Service schema) ──
export interface ServiceImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  moderationStatus: ModerationStatus;
}

export interface Service {
  _id: string;
  provider: string; // ObjectId ref → User
  title: string;
  description?: string;
  category?: string;
  price: number;
  durationMinutes: number;
  images: ServiceImage[];
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: string;
  updatedAt: string;
}

// ── WorkingHour (matches backend Mongoose WorkingHour schema) ──
export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface WorkingBreak {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface WorkingHour {
  _id: string;
  provider: string; // ObjectId ref → User
  dayOfWeek: DayOfWeek;
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  isClosed: boolean;
  slotIntervalMinutes: 15 | 30 | 45 | 60;
  breaks: WorkingBreak[];
  createdAt: string;
  updatedAt: string;
}

// ── Appointment (matches backend Mongoose Appointment schema) ──
export type AppointmentStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed';

export type AppointmentPaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Appointment {
  _id: string;
  customer: string;       // ObjectId ref → User
  provider: string;       // ObjectId ref → User
  service: string;        // ObjectId ref → Service
  date: string;           // ISO date
  localDate: string;      // YYYY-MM-DD
  startTime: string;      // HH:mm
  endTime: string;        // HH:mm
  status: AppointmentStatus;
  paymentStatus: AppointmentPaymentStatus;
  notes?: string;
  timezone: string;
  cancellationReason?: string;
  cancelledBy?: string;   // ObjectId ref → User
  cancelledAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  completedAt?: string;
  reminderSentAt?: string;
  reviewRequestSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Review (matches backend Mongoose Review schema) ──
export interface Review {
  _id: string;
  appointment: string;  // ObjectId ref → Appointment
  customer: string;    // ObjectId ref → User
  provider: string;    // ObjectId ref → User
  service: string;     // ObjectId ref → Service
  rating: number;      // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Payment (matches backend Mongoose Payment schema) ──
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Payment {
  _id: string;
  appointment: string; // ObjectId ref → Appointment
  customer: string;    // ObjectId ref → User
  provider: string;    // ObjectId ref → User
  amount: number;
  currency: string;    // 3-letter ISO code, lowercase
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}
