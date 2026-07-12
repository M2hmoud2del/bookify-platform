import {
  Appointment,
  AppointmentStatus,
  AppointmentPaymentStatus,
  Review,
  Service,
  User,
  ProviderProfile,
} from '../../../core/models/user.model';

// ── Populated Appointment (what the API returns with refs populated) ──
export interface PopulatedAppointment extends Omit<Appointment, 'customer' | 'provider' | 'service'> {
  customer: User;
  provider: User;
  service: Service;
}

export interface CustomerAppointmentView {
  appointment: PopulatedAppointment;
  providerProfile?: ProviderProfile;
}

// ── Populated Review (what the API returns with refs populated) ──
export interface PopulatedReview extends Omit<Review, 'customer' | 'provider' | 'service' | 'appointment'> {
  customer: User;
  provider: User;
  service: Service;
  appointment: PopulatedAppointment;
}

// ── Timeline (derived from Appointment fields, no invented data) ──
export interface TimelineEvent {
  status: string;
  label: string;
  description: string;
  date: string;
  time: string;
  icon: string;
  completed: boolean;
}

// ── Time Slot (derived from WorkingHour + existing Appointments) ──
export interface TimeSlot {
  time: string;   // HH:mm
  label: string;  // display
  available: boolean;
}

export interface CalendarDay {
  date: number;
  dateObj: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isSelectable: boolean;
  hasAvailability: boolean;
}

// ── Mock Data ──
const mockCustomerUser: User = {
  _id: 'cust-001',
  name: 'Alex Demo',
  email: 'alex@bookify.com',
  role: 'customer',
  authProvider: 'local',
  phone: '+1 (212) 555-0100',
  avatar: undefined,
  isActive: true,
  deletedAt: null,
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
};

const mockProviderUsers: Record<string, User> = {
  'prov-001': {
    _id: 'prov-001', name: 'Blossom Beauty Salon', email: 'hello@blossombeauty.com',
    role: 'provider', authProvider: 'local', phone: '+1 (212) 555-0142',
    avatar: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=200',
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'prov-002': {
    _id: 'prov-002', name: 'Dr. Michael Chen', email: 'info@drchenclinic.com',
    role: 'provider', authProvider: 'local', phone: '+1 (617) 555-0198',
    avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=200',
    isActive: true, deletedAt: null, createdAt: '2025-10-15T10:00:00Z', updatedAt: '2025-10-15T10:00:00Z',
  },
  'prov-003': {
    _id: 'prov-003', name: 'PowerHouse Fitness Studio', email: 'train@powerhousefit.com',
    role: 'provider', authProvider: 'local', phone: '+1 (213) 555-0167',
    avatar: 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=200',
    isActive: true, deletedAt: null, createdAt: '2025-09-20T10:00:00Z', updatedAt: '2025-09-20T10:00:00Z',
  },
  'prov-004': {
    _id: 'prov-004', name: 'Legal Partners Consulting', email: 'contact@legalpartners.com',
    role: 'provider', authProvider: 'local', phone: '+1 (312) 555-0123',
    avatar: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=200',
    isActive: true, deletedAt: null, createdAt: '2025-08-10T10:00:00Z', updatedAt: '2025-08-10T10:00:00Z',
  },
  'prov-006': {
    _id: 'prov-006', name: 'AutoCare Pro Service Center', email: 'service@autocarepro.com',
    role: 'provider', authProvider: 'local', phone: '+1 (713) 555-0145',
    avatar: 'https://images.pexels.com/photos/4480705/pexels-photo-4480705.jpeg?auto=compress&cs=tinysrgb&w=200',
    isActive: true, deletedAt: null, createdAt: '2025-07-05T10:00:00Z', updatedAt: '2025-07-05T10:00:00Z',
  },
};

const mockServices: Record<string, Service> = {
  'svc-001': {
    _id: 'svc-001', provider: 'prov-001', title: 'Haircut & Styling',
    description: 'Professional haircut and styling session with our expert stylists.',
    category: 'beauty', price: 65, durationMinutes: 45,
    images: [{ url: 'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-1', width: 400, height: 300, format: 'jpg', bytes: 180000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'svc-002': {
    _id: 'svc-002', provider: 'prov-001', title: 'Hair Coloring',
    description: 'Full hair coloring service using premium ammonia-free products.',
    category: 'beauty', price: 120, durationMinutes: 90,
    images: [{ url: 'https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-2', width: 400, height: 300, format: 'jpg', bytes: 210000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'svc-003': {
    _id: 'svc-003', provider: 'prov-001', title: 'Beard Trim & Shape',
    description: 'Professional beard grooming and shaping.', category: 'beauty', price: 35, durationMinutes: 30,
    images: [{ url: 'https://images.pexels.com/photos/995300/pexels-photo-995300.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-3', width: 400, height: 300, format: 'jpg', bytes: 160000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'svc-004': {
    _id: 'svc-004', provider: 'prov-001', title: 'Facial Treatment',
    description: 'Rejuvenating facial treatment with deep cleansing and moisturizing.', category: 'beauty', price: 85, durationMinutes: 60,
    images: [{ url: 'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-4', width: 400, height: 300, format: 'jpg', bytes: 195000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'svc-005': {
    _id: 'svc-005', provider: 'prov-001', title: 'Manicure & Pedicure',
    description: 'Complete nail care treatment for hands and feet.', category: 'beauty', price: 55, durationMinutes: 75,
    images: [{ url: 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-5', width: 400, height: 300, format: 'jpg', bytes: 165000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  'svc-021': {
    _id: 'svc-021', provider: 'prov-002', title: 'General Consultation',
    description: 'Comprehensive health check-up and consultation.', category: 'health', price: 150, durationMinutes: 30,
    images: [{ url: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-21', width: 400, height: 300, format: 'jpg', bytes: 200000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-10-15T10:00:00Z', updatedAt: '2025-10-15T10:00:00Z',
  },
  'svc-031': {
    _id: 'svc-031', provider: 'prov-003', title: 'Personal Training Session',
    description: 'One-on-one personal training with certified instructor.', category: 'fitness', price: 80, durationMinutes: 60,
    images: [{ url: 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-31', width: 400, height: 300, format: 'jpg', bytes: 190000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-09-20T10:00:00Z', updatedAt: '2025-09-20T10:00:00Z',
  },
  'svc-041': {
    _id: 'svc-041', provider: 'prov-004', title: 'Legal Consultation',
    description: 'Initial legal consultation to discuss your case and options.', category: 'consulting', price: 200, durationMinutes: 60,
    images: [{ url: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-41', width: 400, height: 300, format: 'jpg', bytes: 180000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-08-10T10:00:00Z', updatedAt: '2025-08-10T10:00:00Z',
  },
  'svc-061': {
    _id: 'svc-061', provider: 'prov-006', title: 'Oil Change Service',
    description: 'Full-service oil change with filter replacement.', category: 'automotive', price: 45, durationMinutes: 30,
    images: [{ url: 'https://images.pexels.com/photos/4480705/pexels-photo-4480705.jpeg?auto=compress&cs=tinysrgb&w=400', publicId: 'img-61', width: 400, height: 300, format: 'jpg', bytes: 170000, moderationStatus: 'approved' }],
    isActive: true, deletedAt: null, createdAt: '2025-07-05T10:00:00Z', updatedAt: '2025-07-05T10:00:00Z',
  },
};

export const MOCK_APPOINTMENTS: PopulatedAppointment[] = [
  {
    _id: 'apt-1', customer: mockCustomerUser, provider: mockProviderUsers['prov-001'], service: mockServices['svc-001'],
    date: '2026-07-15T00:00:00Z', localDate: '2026-07-15', startTime: '10:00', endTime: '10:45',
    status: 'confirmed', paymentStatus: 'paid', notes: 'Please arrive 10 minutes early.',
    timezone: 'America/New_York', createdAt: '2026-07-10T14:30:00Z', updatedAt: '2026-07-10T14:30:00Z',
  },
  {
    _id: 'apt-2', customer: mockCustomerUser, provider: mockProviderUsers['prov-002'], service: mockServices['svc-021'],
    date: '2026-07-18T00:00:00Z', localDate: '2026-07-18', startTime: '14:00', endTime: '14:30',
    status: 'pending_payment', paymentStatus: 'unpaid', notes: undefined,
    timezone: 'America/New_York', createdAt: '2026-07-11T09:15:00Z', updatedAt: '2026-07-11T09:15:00Z',
  },
  {
    _id: 'apt-3', customer: mockCustomerUser, provider: mockProviderUsers['prov-003'], service: mockServices['svc-031'],
    date: '2026-06-28T00:00:00Z', localDate: '2026-06-28', startTime: '08:00', endTime: '09:00',
    status: 'completed', paymentStatus: 'paid', notes: 'Great session!',
    timezone: 'America/Los_Angeles', completedAt: '2026-06-28T09:00:00Z',
    createdAt: '2026-06-20T11:00:00Z', updatedAt: '2026-06-28T09:00:00Z',
  },
  {
    _id: 'apt-4', customer: mockCustomerUser, provider: mockProviderUsers['prov-001'], service: mockServices['svc-004'],
    date: '2026-06-15T00:00:00Z', localDate: '2026-06-15', startTime: '11:00', endTime: '12:00',
    status: 'completed', paymentStatus: 'paid', notes: undefined,
    timezone: 'America/New_York', completedAt: '2026-06-15T12:00:00Z',
    createdAt: '2026-06-10T16:45:00Z', updatedAt: '2026-06-15T12:00:00Z',
  },
  {
    _id: 'apt-5', customer: mockCustomerUser, provider: mockProviderUsers['prov-004'], service: mockServices['svc-041'],
    date: '2026-07-22T00:00:00Z', localDate: '2026-07-22', startTime: '15:00', endTime: '16:00',
    status: 'confirmed', paymentStatus: 'paid', notes: 'Bring all relevant documents.',
    timezone: 'America/Chicago', createdAt: '2026-07-08T10:20:00Z', updatedAt: '2026-07-08T10:20:00Z',
  },
  {
    _id: 'apt-6', customer: mockCustomerUser, provider: mockProviderUsers['prov-006'], service: mockServices['svc-061'],
    date: '2026-06-10T00:00:00Z', localDate: '2026-06-10', startTime: '09:00', endTime: '09:30',
    status: 'cancelled', paymentStatus: 'refunded', notes: undefined,
    timezone: 'America/Chicago', cancellationReason: 'Schedule conflict',
    cancelledBy: 'cust-001', cancelledAt: '2026-06-08T10:00:00Z',
    createdAt: '2026-06-05T13:00:00Z', updatedAt: '2026-06-08T10:00:00Z',
  },
];

export const MOCK_REVIEWS: PopulatedReview[] = [
  {
    _id: 'rev-1', appointment: MOCK_APPOINTMENTS[2], customer: mockCustomerUser,
    provider: mockProviderUsers['prov-003'], service: mockServices['svc-031'],
    rating: 5, comment: 'Amazing session! The trainer was very knowledgeable and pushed me to my limits. I feel stronger already.',
    createdAt: '2026-06-29T10:00:00Z', updatedAt: '2026-06-29T10:00:00Z',
  },
  {
    _id: 'rev-2', appointment: MOCK_APPOINTMENTS[3], customer: mockCustomerUser,
    provider: mockProviderUsers['prov-001'], service: mockServices['svc-004'],
    rating: 4, comment: 'Very relaxing facial treatment. The staff was professional and the environment was clean and calming.',
    createdAt: '2026-06-16T10:00:00Z', updatedAt: '2026-06-16T10:00:00Z',
  },
];

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  { time: '09:00', label: '9:00 AM',  available: true  },
  { time: '09:30', label: '9:30 AM',  available: false },
  { time: '10:00', label: '10:00 AM', available: true  },
  { time: '10:30', label: '10:30 AM', available: true  },
  { time: '11:00', label: '11:00 AM', available: false },
  { time: '11:30', label: '11:30 AM', available: true  },
  { time: '12:00', label: '12:00 PM', available: false },
  { time: '12:30', label: '12:30 PM', available: false },
  { time: '13:00', label: '1:00 PM',  available: true  },
  { time: '13:30', label: '1:30 PM',  available: true  },
  { time: '14:00', label: '2:00 PM',  available: true  },
  { time: '14:30', label: '2:30 PM',  available: false },
  { time: '15:00', label: '3:00 PM',  available: true  },
  { time: '15:30', label: '3:30 PM',  available: true  },
  { time: '16:00', label: '4:00 PM',  available: false },
  { time: '16:30', label: '4:30 PM',  available: true  },
];

export function getAppointmentById(id: string): PopulatedAppointment | undefined {
  return MOCK_APPOINTMENTS.find(a => a._id === id);
}

export function getTimelineForAppointment(appointment: PopulatedAppointment): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      status: 'created',
      label: 'Booking Created',
      description: `Appointment was booked on ${formatDate(appointment.createdAt)}`,
      date: appointment.createdAt,
      time: formatTime(appointment.createdAt),
      icon: 'receipt_long',
      completed: true,
    },
  ];

  if (appointment.status === 'confirmed' || appointment.status === 'completed') {
    events.push({
      status: 'confirmed',
      label: 'Confirmed',
      description: 'Provider confirmed the appointment',
      date: appointment.createdAt,
      time: formatTime(appointment.createdAt),
      icon: 'verified',
      completed: true,
    });
  }

  if (appointment.status === 'pending_payment') {
    events.push({
      status: 'pending_payment',
      label: 'Awaiting Payment',
      description: 'Complete payment to confirm your booking',
      date: appointment.createdAt,
      time: formatTime(appointment.createdAt),
      icon: 'pending_actions',
      completed: false,
    });
  }

  if (appointment.paymentStatus === 'paid') {
    events.push({
      status: 'paid',
      label: 'Payment Completed',
      description: `$${appointment.service.price} payment processed successfully`,
      date: appointment.createdAt,
      time: formatTime(appointment.createdAt),
      icon: 'payments',
      completed: true,
    });
  }

  if (appointment.status === 'completed' && appointment.completedAt) {
    events.push({
      status: 'completed',
      label: 'Appointment Completed',
      description: 'Service was successfully completed',
      date: appointment.completedAt,
      time: formatTime(appointment.completedAt),
      icon: 'task_alt',
      completed: true,
    });
  }

  if (appointment.status === 'cancelled') {
    events.push({
      status: 'cancelled',
      label: 'Appointment Cancelled',
      description: appointment.cancellationReason ?? 'This appointment was cancelled',
      date: appointment.cancelledAt ?? appointment.updatedAt,
      time: formatTime(appointment.cancelledAt ?? appointment.updatedAt),
      icon: 'cancel',
      completed: true,
    });
  }

  if (appointment.status === 'rejected') {
    events.push({
      status: 'rejected',
      label: 'Appointment Rejected',
      description: appointment.rejectionReason ?? 'Provider rejected this appointment',
      date: appointment.rejectedAt ?? appointment.updatedAt,
      time: formatTime(appointment.rejectedAt ?? appointment.updatedAt),
      icon: 'block',
      completed: true,
    });
  }

  if (['confirmed', 'pending_payment'].includes(appointment.status)) {
    events.push({
      status: 'upcoming',
      label: 'Upcoming Appointment',
      description: `Scheduled for ${formatDate(appointment.localDate)} at ${formatTimeStr(appointment.startTime)}`,
      date: appointment.localDate,
      time: appointment.startTime,
      icon: 'event',
      completed: false,
    });
  }

  return events;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatTimeStr(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${period}`;
}
