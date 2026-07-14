import {
  Appointment,
  AppointmentStatus,
  AppointmentPaymentStatus,
  Review,
  Service,
  User,
  ProviderProfile,
  WorkingHour,
  DayOfWeek,
  Payment,
  ServiceImage,
} from '../../../core/models/user.model';

// Re-export core models so provider components can import everything from one place
export {
  Service,
  User,
  ProviderProfile,
  WorkingHour,
  DayOfWeek,
  Payment,
  ServiceImage,
  AppointmentStatus,
  AppointmentPaymentStatus,
};

// ── Populated Appointment (what the API returns with refs populated) ──
export interface PopulatedAppointment extends Omit<Appointment, 'customer' | 'provider' | 'service'> {
  customer: User;
  provider: User;
  service: Service;
}

export interface PopulatedReview extends Omit<Review, 'customer' | 'provider' | 'service' | 'appointment'> {
  customer: User;
  provider: User;
  service: Service;
  appointment: PopulatedAppointment;
}

export interface PopulatedPayment extends Omit<Payment, 'appointment' | 'customer' | 'provider'> {
  appointment: Appointment;
  customer: User;
  provider: User;
}

// ── Timeline (derived from Appointment fields) ──
export interface TimelineEvent {
  status: string;
  label: string;
  description: string;
  date: string;
  time: string;
  icon: string;
  completed: boolean;
}

// ── Revenue (derived from Payment records, not a separate model) ──
export interface RevenueData {
  month: string;
  revenue: number;
  appointments: number;
}

// ── Mock Provider User ──
const mockProviderUser: User = {
  _id: 'prov-001',
  name: 'Blossom Beauty Salon',
  email: 'hello@blossombeauty.com',
  role: 'provider',
  authProvider: 'local',
  phone: '+1 (212) 555-0142',
  avatar: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=200',
  isActive: true,
  deletedAt: null,
  createdAt: '2025-11-01T10:00:00Z',
  updatedAt: '2025-11-01T10:00:00Z',
};

const mockCustomerUsers: Record<string, User> = {
  'cust-1': {
    _id: 'cust-1', name: 'Emma Wilson', email: 'emma.wilson@example.com',
    role: 'customer', authProvider: 'local', phone: '+1 (212) 555-0142',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true, deletedAt: null, createdAt: '2026-01-10T10:00:00Z', updatedAt: '2026-01-10T10:00:00Z',
  },
  'cust-2': {
    _id: 'cust-2', name: 'James Brown', email: 'james.brown@example.com',
    role: 'customer', authProvider: 'local', phone: '+1 (212) 555-0167',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true, deletedAt: null, createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z',
  },
  'cust-3': {
    _id: 'cust-3', name: 'Marcus Lee', email: 'marcus.lee@example.com',
    role: 'customer', authProvider: 'local', phone: '+1 (212) 555-0189',
    avatar: undefined, isActive: true, deletedAt: null, createdAt: '2026-03-20T10:00:00Z', updatedAt: '2026-03-20T10:00:00Z',
  },
  'cust-4': {
    _id: 'cust-4', name: 'Sophie Martin', email: 'sophie.martin@example.com',
    role: 'customer', authProvider: 'local', phone: '+1 (212) 555-0123',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true, deletedAt: null, createdAt: '2026-04-05T10:00:00Z', updatedAt: '2026-04-05T10:00:00Z',
  },
  'cust-5': {
    _id: 'cust-5', name: 'David Chen', email: 'david.chen@example.com',
    role: 'customer', authProvider: 'local', phone: '+1 (212) 555-0145',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true, deletedAt: null, createdAt: '2026-01-25T10:00:00Z', updatedAt: '2026-01-25T10:00:00Z',
  },
  'cust-6': {
    _id: 'cust-6', name: 'Lisa Anderson', email: 'lisa.a@example.com',
    role: 'customer', authProvider: 'local', phone: '+1 (212) 555-0178',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    isActive: true, deletedAt: null, createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-02-10T10:00:00Z',
  },
  'cust-7': {
    _id: 'cust-7', name: 'Robert Taylor', email: 'robert.t@example.com',
    role: 'customer', authProvider: 'local', phone: '+1 (212) 555-0190',
    avatar: undefined, isActive: true, deletedAt: null, createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z',
  },
};

const mockServices: Record<string, Service> = {
  'svc-1': {
    _id: 'svc-1', provider: 'prov-001', title: 'Haircut & Styling',
    description: 'Professional haircut and styling session tailored to your preferences.',
    category: 'Hair Care', price: 65, durationMinutes: 45,
    images: [{ url: 'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-1', width: 400, height: 300, format: 'jpg', bytes: 180000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'svc-2': {
    _id: 'svc-2', provider: 'prov-001', title: 'Hair Coloring',
    description: 'Full hair coloring service with premium products.',
    category: 'Hair Care', price: 120, durationMinutes: 90,
    images: [{ url: 'https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-2', width: 400, height: 300, format: 'jpg', bytes: 210000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'svc-3': {
    _id: 'svc-3', provider: 'prov-001', title: 'Beard Trim & Shape',
    description: 'Professional beard grooming and shaping.',
    category: 'Grooming', price: 35, durationMinutes: 30,
    images: [{ url: 'https://images.pexels.com/photos/995300/pexels-photo-995300.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-3', width: 400, height: 300, format: 'jpg', bytes: 160000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'svc-4': {
    _id: 'svc-4', provider: 'prov-001', title: 'Facial Treatment',
    description: 'Deep cleansing facial treatment for healthy skin.',
    category: 'Skincare', price: 85, durationMinutes: 60,
    images: [{ url: 'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-4', width: 400, height: 300, format: 'jpg', bytes: 195000, moderationStatus: 'approved' }],
    isActive: false, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
};

export const MOCK_PROVIDER_APPOINTMENTS: PopulatedAppointment[] = [
  {
    _id: 'apt-1', customer: mockCustomerUsers['cust-1'], provider: mockProviderUser, service: mockServices['svc-1'],
    date: '2026-07-12T00:00:00Z', localDate: '2026-07-12', startTime: '09:00', endTime: '09:45',
    status: 'confirmed', paymentStatus: 'paid', notes: 'First-time customer, prefers scissors.',
    timezone: 'America/New_York', createdAt: '2026-07-08T14:30:00Z', updatedAt: '2026-07-08T14:30:00Z',
  },
  {
    _id: 'apt-2', customer: mockCustomerUsers['cust-2'], provider: mockProviderUser, service: mockServices['svc-2'],
    date: '2026-07-12T00:00:00Z', localDate: '2026-07-12', startTime: '10:30', endTime: '12:00',
    status: 'confirmed', paymentStatus: 'paid', notes: undefined,
    timezone: 'America/New_York', createdAt: '2026-07-06T10:00:00Z', updatedAt: '2026-07-06T10:00:00Z',
  },
  {
    _id: 'apt-3', customer: mockCustomerUsers['cust-3'], provider: mockProviderUser, service: mockServices['svc-3'],
    date: '2026-07-12T00:00:00Z', localDate: '2026-07-12', startTime: '14:00', endTime: '14:30',
    status: 'confirmed', paymentStatus: 'unpaid', notes: 'Regular customer',
    timezone: 'America/New_York', createdAt: '2026-07-10T09:15:00Z', updatedAt: '2026-07-10T09:15:00Z',
  },
  {
    _id: 'apt-4', customer: mockCustomerUsers['cust-4'], provider: mockProviderUser, service: mockServices['svc-4'],
    date: '2026-07-13T00:00:00Z', localDate: '2026-07-13', startTime: '11:00', endTime: '12:00',
    status: 'pending_payment', paymentStatus: 'unpaid', notes: undefined,
    timezone: 'America/New_York', createdAt: '2026-07-11T16:00:00Z', updatedAt: '2026-07-11T16:00:00Z',
  },
  {
    _id: 'apt-5', customer: mockCustomerUsers['cust-5'], provider: mockProviderUser, service: mockServices['svc-1'],
    date: '2026-06-28T00:00:00Z', localDate: '2026-06-28', startTime: '15:00', endTime: '15:45',
    status: 'completed', paymentStatus: 'paid', notes: 'Great customer, tips well.',
    timezone: 'America/New_York', completedAt: '2026-06-28T15:45:00Z',
    createdAt: '2026-06-20T11:00:00Z', updatedAt: '2026-06-28T15:45:00Z',
  },
  {
    _id: 'apt-6', customer: mockCustomerUsers['cust-6'], provider: mockProviderUser, service: mockServices['svc-1'],
    date: '2026-06-25T00:00:00Z', localDate: '2026-06-25', startTime: '13:00', endTime: '13:45',
    status: 'completed', paymentStatus: 'paid', notes: undefined,
    timezone: 'America/New_York', completedAt: '2026-06-25T13:45:00Z',
    createdAt: '2026-06-18T12:00:00Z', updatedAt: '2026-06-25T13:45:00Z',
  },
  {
    _id: 'apt-7', customer: mockCustomerUsers['cust-7'], provider: mockProviderUser, service: mockServices['svc-2'],
    date: '2026-07-14T00:00:00Z', localDate: '2026-07-14', startTime: '16:00', endTime: '17:30',
    status: 'cancelled', paymentStatus: 'refunded', notes: 'Customer cancelled due to emergency.',
    timezone: 'America/New_York', cancellationReason: 'Customer emergency',
    cancelledBy: 'cust-7', cancelledAt: '2026-07-10T08:00:00Z',
    createdAt: '2026-07-05T08:00:00Z', updatedAt: '2026-07-10T08:00:00Z',
  },
];

export const MOCK_PROVIDER_REVIEWS: PopulatedReview[] = [
  {
    _id: 'rev-1', appointment: MOCK_PROVIDER_APPOINTMENTS[4], customer: mockCustomerUsers['cust-1'],
    provider: mockProviderUser, service: mockServices['svc-1'],
    rating: 5, comment: 'Amazing service! Sarah did an incredible job with my hair. The salon is clean, modern, and the staff is very friendly. Will definitely come back!',
    createdAt: '2026-06-28T16:00:00Z', updatedAt: '2026-06-28T16:00:00Z',
  },
  {
    _id: 'rev-2', appointment: MOCK_PROVIDER_APPOINTMENTS[5], customer: mockCustomerUsers['cust-5'],
    provider: mockProviderUser, service: mockServices['svc-1'],
    rating: 4, comment: 'Great haircut, very professional. A bit pricey but worth it for the quality.',
    createdAt: '2026-06-25T14:00:00Z', updatedAt: '2026-06-25T14:00:00Z',
  },
  {
    _id: 'rev-3', appointment: MOCK_PROVIDER_APPOINTMENTS[3], customer: mockCustomerUsers['cust-6'],
    provider: mockProviderUser, service: mockServices['svc-1'],
    rating: 5, comment: 'Best nail care experience in the city! The attention to detail is incredible.',
    createdAt: '2026-06-20T15:00:00Z', updatedAt: '2026-06-20T15:00:00Z',
  },
  {
    _id: 'rev-4', appointment: MOCK_PROVIDER_APPOINTMENTS[2], customer: mockCustomerUsers['cust-3'],
    provider: mockProviderUser, service: mockServices['svc-3'],
    rating: 4, comment: 'Good beard trim, quick and clean. Would recommend.',
    createdAt: '2026-06-15T12:00:00Z', updatedAt: '2026-06-15T12:00:00Z',
  },
];

export const MOCK_PROVIDER_SERVICES: Service[] = Object.values(mockServices);

export const MOCK_WORKING_HOURS: WorkingHour[] = [
  { _id: 'wh-1', provider: 'prov-001', dayOfWeek: 'monday',    startTime: '09:00', endTime: '17:00', isClosed: false, slotIntervalMinutes: 30, breaks: [{ startTime: '12:00', endTime: '13:00' }], createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  { _id: 'wh-2', provider: 'prov-001', dayOfWeek: 'tuesday',   startTime: '09:00', endTime: '17:00', isClosed: false, slotIntervalMinutes: 30, breaks: [{ startTime: '12:00', endTime: '13:00' }], createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  { _id: 'wh-3', provider: 'prov-001', dayOfWeek: 'wednesday', startTime: '09:00', endTime: '17:00', isClosed: false, slotIntervalMinutes: 30, breaks: [{ startTime: '12:00', endTime: '13:00' }], createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  { _id: 'wh-4', provider: 'prov-001', dayOfWeek: 'thursday',  startTime: '09:00', endTime: '17:00', isClosed: false, slotIntervalMinutes: 30, breaks: [{ startTime: '12:00', endTime: '13:00' }], createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  { _id: 'wh-5', provider: 'prov-001', dayOfWeek: 'friday',    startTime: '09:00', endTime: '18:00', isClosed: false, slotIntervalMinutes: 30, breaks: [{ startTime: '12:00', endTime: '13:00' }], createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  { _id: 'wh-6', provider: 'prov-001', dayOfWeek: 'saturday',  startTime: '10:00', endTime: '16:00', isClosed: false, slotIntervalMinutes: 30, breaks: [], createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  { _id: 'wh-7', provider: 'prov-001', dayOfWeek: 'sunday',    startTime: undefined, endTime: undefined, isClosed: true, slotIntervalMinutes: 30, breaks: [], createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
];

export const MOCK_REVENUE_DATA: RevenueData[] = [
  { month: 'Jan', revenue: 2400, appointments: 32 },
  { month: 'Feb', revenue: 2800, appointments: 38 },
  { month: 'Mar', revenue: 3100, appointments: 42 },
  { month: 'Apr', revenue: 2900, appointments: 39 },
  { month: 'May', revenue: 3400, appointments: 48 },
  { month: 'Jun', revenue: 3800, appointments: 52 },
  { month: 'Jul', revenue: 3250, appointments: 45 },
];

export const MOCK_PROVIDER_PROFILE: ProviderProfile = {
  _id: 'pp-001',
  user: 'prov-001',
  businessName: 'Blossom Beauty Salon',
  bio: 'A premier beauty salon offering a wide range of services including haircuts, coloring, styling, facials, and spa treatments. Our experienced team uses only the finest products to ensure you look and feel your best.',
  category: 'beauty',
  address: '123 Beauty Avenue',
  city: 'New York',
  profileImage: {
    url: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    publicId: 'profile-001',
    width: 400,
    height: 400,
    format: 'jpg',
    bytes: 245000,
    moderationStatus: 'approved',
  },
  timezone: 'America/New_York',
  ratingAverage: 4.9,
  ratingCount: 128,
  isVerified: true,
  deletedAt: null,
  createdAt: '2025-11-01T10:00:00Z',
  updatedAt: '2025-11-01T10:00:00Z',
};

export function getProviderAppointmentById(id: string): PopulatedAppointment | undefined {
  return MOCK_PROVIDER_APPOINTMENTS.find(a => a._id === id);
}
