import {
  User,
  ProviderProfile,
  Service,
  Review,
  Appointment,
  ServiceImage,
} from '../../../core/models/user.model';

// ── Public-facing populated views (joined from backend models) ──
export interface PublicProvider {
  user: User;
  profile: ProviderProfile;
  services: Service[];
  reviews: Review[];
}

export interface PublicService {
  service: Service;
  provider: PublicProvider;
}

// ── Search filters (UI-only, not a backend model) ──
export interface SearchFilters {
  query: string;
  category: string | null;
  minRating: number;
  maxPrice: number | null;
  location: string;
  sortBy: 'rating' | 'price_low' | 'price_high' | 'reviews';
}

export const PROVIDER_CATEGORIES = [
  { id: 'all',          label: 'All Categories',  icon: 'apps' },
  { id: 'beauty',       label: 'Beauty & Salon', icon: 'content_cut' },
  { id: 'health',       label: 'Health & Medical', icon: 'local_hospital' },
  { id: 'fitness',      label: 'Fitness & Wellness', icon: 'fitness_center' },
  { id: 'consulting',   label: 'Consulting',     icon: 'business_center' },
  { id: 'education',    label: 'Education',      icon: 'school' },
  { id: 'automotive',   label: 'Automotive',     icon: 'directions_car' },
  { id: 'home',         label: 'Home Services',   icon: 'home_repair_service' },
] as const;

export const SORT_OPTIONS = [
  { value: 'rating',     label: 'Top Rated' },
  { value: 'reviews',    label: 'Most Reviewed' },
  { value: 'price_low',  label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
] as const;

// ── Mock Data ──
function makeImage(url: string, publicId: string): ServiceImage {
  return { url, publicId, width: 400, height: 300, format: 'jpg', bytes: 180000, moderationStatus: 'approved' };
}

function makeUser(_id: string, name: string, email: string, phone: string, avatar: string): User {
  return { _id, name, email, role: 'provider', authProvider: 'local', phone, avatar, isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' };
}

function makeProfile(_id: string, user: string, businessName: string, bio: string, category: string, city: string, avatarUrl: string, rating: number, reviewCount: number, verified: boolean): ProviderProfile {
  return {
    _id, user, businessName, bio, category, address: `${businessName}, ${city}`, city,
    profileImage: { url: avatarUrl, publicId: `pi-${_id}`, width: 200, height: 200, format: 'jpg', bytes: 80000, moderationStatus: 'approved' },
    timezone: 'UTC', ratingAverage: rating, ratingCount: reviewCount, isVerified: verified, deletedAt: null,
    createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  };
}

const users: Record<string, User> = {
  '1': makeUser('1', 'Blossom Beauty Salon', 'hello@blossombeauty.com', '+1 (212) 555-0142', 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=200'),
  '2': makeUser('2', 'Dr. Michael Chen - Family Medicine', 'info@drchenclinic.com', '+1 (617) 555-0198', 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=200'),
  '3': makeUser('3', 'PowerHouse Fitness Studio', 'train@powerhousefit.com', '+1 (213) 555-0167', 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=200'),
  '4': makeUser('4', 'Legal Partners Consulting', 'contact@legalpartners.com', '+1 (312) 555-0123', 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=200'),
  '5': makeUser('5', 'Bright Minds Tutoring', 'learn@brightminds.com', '+1 (415) 555-0189', 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=200'),
  '6': makeUser('6', 'AutoCare Pro Service Center', 'service@autocarepro.com', '+1 (713) 555-0145', 'https://images.pexels.com/photos/4480705/pexels-photo-4480705.jpeg?auto=compress&cs=tinysrgb&w=200'),
};

const profiles: Record<string, ProviderProfile> = {
  '1': makeProfile('pp-1', '1', 'Blossom Beauty Salon', 'A premier beauty salon offering a wide range of services including haircuts, coloring, styling, facials, and spa treatments. Our experienced team uses only the finest products to ensure you look and feel your best.', 'beauty', 'New York', users['1'].avatar!, 4.9, 128, true),
  '2': makeProfile('pp-2', '2', 'Dr. Michael Chen - Family Medicine', 'Comprehensive family medicine practice providing personalized healthcare for all ages. Dr. Chen has over 15 years of experience in preventive care, chronic disease management, and wellness programs.', 'health', 'Boston', users['2'].avatar!, 4.8, 89, true),
  '3': makeProfile('pp-3', '3', 'PowerHouse Fitness Studio', 'State-of-the-art fitness studio offering personal training, group classes, and specialized wellness programs. Our certified trainers help you achieve your fitness goals with personalized plans.', 'fitness', 'Los Angeles', users['3'].avatar!, 4.7, 156, true),
  '4': makeProfile('pp-4', '4', 'Legal Partners Consulting', 'Experienced legal consulting firm specializing in business law, contracts, and intellectual property. We provide clear, actionable legal advice for businesses and individuals.', 'consulting', 'Chicago', users['4'].avatar!, 4.6, 67, true),
  '5': makeProfile('pp-5', '5', 'Bright Minds Tutoring', 'Personalized tutoring services for students of all ages. We specialize in math, science, and language arts, helping students achieve their academic goals.', 'education', 'San Francisco', users['5'].avatar!, 4.8, 94, false),
  '6': makeProfile('pp-6', '6', 'AutoCare Pro Service Center', 'Full-service auto repair and maintenance center. Our ASE-certified mechanics handle everything from oil changes to major engine repairs with honesty and expertise.', 'automotive', 'Houston', users['6'].avatar!, 4.5, 112, true),
};

const services: Record<string, Service> = {
  '1-1': { _id: '1-1', provider: '1', title: 'Haircut & Styling', description: 'Professional haircut and styling session with our expert stylists.', category: 'beauty', price: 65, durationMinutes: 45, images: [makeImage('https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-1-1')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '1-2': { _id: '1-2', provider: '1', title: 'Hair Coloring', description: 'Full hair coloring service using premium ammonia-free products.', category: 'beauty', price: 120, durationMinutes: 90, images: [makeImage('https://images.pexels.com/photos/3993456/pexels-photo-3993456.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-1-2')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '1-3': { _id: '1-3', provider: '1', title: 'Beard Trim & Shape', description: 'Professional beard grooming and shaping.', category: 'beauty', price: 35, durationMinutes: 30, images: [makeImage('https://images.pexels.com/photos/995300/pexels-photo-995300.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-1-3')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '1-4': { _id: '1-4', provider: '1', title: 'Facial Treatment', description: 'Rejuvenating facial treatment with deep cleansing and moisturizing.', category: 'beauty', price: 85, durationMinutes: 60, images: [makeImage('https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-1-4')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '1-5': { _id: '1-5', provider: '1', title: 'Manicure & Pedicure', description: 'Complete nail care treatment for hands and feet.', category: 'beauty', price: 55, durationMinutes: 75, images: [makeImage('https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-1-5')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '2-1': { _id: '2-1', provider: '2', title: 'General Consultation', description: 'Comprehensive health check-up and consultation.', category: 'health', price: 150, durationMinutes: 30, images: [makeImage('https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-2-1')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '2-2': { _id: '2-2', provider: '2', title: 'Annual Physical Exam', description: 'Complete annual physical examination with lab work.', category: 'health', price: 280, durationMinutes: 60, images: [makeImage('https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-2-2')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '2-3': { _id: '2-3', provider: '2', title: 'Vaccination', description: 'Adult and pediatric vaccination services.', category: 'health', price: 45, durationMinutes: 15, images: [makeImage('https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-2-3')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '2-4': { _id: '2-4', provider: '2', title: 'Telemedicine Visit', description: 'Remote video consultation from the comfort of your home.', category: 'health', price: 90, durationMinutes: 20, images: [makeImage('https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-2-4')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '3-1': { _id: '3-1', provider: '3', title: 'Personal Training Session', description: 'One-on-one personal training with certified instructor.', category: 'fitness', price: 80, durationMinutes: 60, images: [makeImage('https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-3-1')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '3-2': { _id: '3-2', provider: '3', title: 'Group Yoga Class', description: 'Energizing group yoga session for all skill levels.', category: 'fitness', price: 25, durationMinutes: 45, images: [makeImage('https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-3-2')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '3-3': { _id: '3-3', provider: '3', title: 'HIIT Training', description: 'High-intensity interval training for maximum calorie burn.', category: 'fitness', price: 35, durationMinutes: 30, images: [makeImage('https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-3-3')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '3-4': { _id: '3-4', provider: '3', title: 'Pilates Session', description: 'Core-strengthening Pilates workout with equipment.', category: 'fitness', price: 45, durationMinutes: 50, images: [makeImage('https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-3-4')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '4-1': { _id: '4-1', provider: '4', title: 'Legal Consultation', description: 'Initial legal consultation to discuss your case and options.', category: 'consulting', price: 200, durationMinutes: 60, images: [makeImage('https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-4-1')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '4-2': { _id: '4-2', provider: '4', title: 'Contract Review', description: 'Professional review and analysis of legal contracts.', category: 'consulting', price: 350, durationMinutes: 90, images: [makeImage('https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-4-2')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '4-3': { _id: '4-3', provider: '4', title: 'Business Formation', description: 'Complete business entity formation and registration service.', category: 'consulting', price: 500, durationMinutes: 120, images: [makeImage('https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-4-3')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '5-1': { _id: '5-1', provider: '5', title: 'Math Tutoring', description: 'Personalized math tutoring for all grade levels.', category: 'education', price: 50, durationMinutes: 60, images: [makeImage('https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-5-1')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '5-2': { _id: '5-2', provider: '5', title: 'Science Tutoring', description: 'Expert science tutoring covering physics, chemistry, and biology.', category: 'education', price: 55, durationMinutes: 60, images: [makeImage('https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-5-2')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '5-3': { _id: '5-3', provider: '5', title: 'SAT/ACT Prep', description: 'Comprehensive test preparation course for college entrance exams.', category: 'education', price: 120, durationMinutes: 120, images: [makeImage('https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-5-3')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '6-1': { _id: '6-1', provider: '6', title: 'Oil Change Service', description: 'Full-service oil change with filter replacement.', category: 'automotive', price: 45, durationMinutes: 30, images: [makeImage('https://images.pexels.com/photos/4480705/pexels-photo-4480705.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-6-1')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '6-2': { _id: '6-2', provider: '6', title: 'Brake Service', description: 'Complete brake inspection and pad replacement.', category: 'automotive', price: 180, durationMinutes: 90, images: [makeImage('https://images.pexels.com/photos/4480705/pexels-photo-4480705.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-6-2')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
  '6-3': { _id: '6-3', provider: '6', title: 'Engine Diagnostics', description: 'Computerized engine diagnostic and troubleshooting.', category: 'automotive', price: 95, durationMinutes: 60, images: [makeImage('https://images.pexels.com/photos/4480705/pexels-photo-4480705.jpeg?auto=compress&cs=tinysrgb&w=400', 'img-6-3')], isActive: true, deletedAt: null, createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z' },
};

const reviews: Record<string, Review> = {
  'r-1-1': { _id: 'r-1-1', appointment: 'apt-1', customer: 'cust-1', provider: '1', service: '1-1', rating: 5, comment: 'Amazing service! Sarah did an incredible job with my hair. The salon is clean, modern, and the staff is very friendly.', createdAt: '2026-06-28T10:00:00Z', updatedAt: '2026-06-28T10:00:00Z' },
  'r-1-2': { _id: 'r-1-2', appointment: 'apt-2', customer: 'cust-2', provider: '1', service: '1-4', rating: 5, comment: 'Best facial I\'ve ever had! My skin feels amazing. Highly recommend the rejuvenating facial treatment.', createdAt: '2026-06-20T10:00:00Z', updatedAt: '2026-06-20T10:00:00Z' },
  'r-1-3': { _id: 'r-1-3', appointment: 'apt-3', customer: 'cust-3', provider: '1', service: '1-1', rating: 4, comment: 'Great haircut, very professional. A bit pricey but worth it for the quality.', createdAt: '2026-06-15T10:00:00Z', updatedAt: '2026-06-15T10:00:00Z' },
  'r-2-1': { _id: 'r-2-1', appointment: 'apt-4', customer: 'cust-4', provider: '2', service: '2-1', rating: 5, comment: 'Dr. Chen is incredibly thorough and takes time to listen. The best family doctor I\'ve had.', createdAt: '2026-06-25T10:00:00Z', updatedAt: '2026-06-25T10:00:00Z' },
  'r-2-2': { _id: 'r-2-2', appointment: 'apt-5', customer: 'cust-5', provider: '2', service: '2-4', rating: 5, comment: 'The telemedicine option saved me so much time. Very convenient and professional.', createdAt: '2026-06-18T10:00:00Z', updatedAt: '2026-06-18T10:00:00Z' },
  'r-3-1': { _id: 'r-3-1', appointment: 'apt-6', customer: 'cust-6', provider: '3', service: '3-1', rating: 5, comment: 'Best gym in LA! The trainers are knowledgeable and the equipment is top-notch.', createdAt: '2026-06-22T10:00:00Z', updatedAt: '2026-06-22T10:00:00Z' },
  'r-3-2': { _id: 'r-3-2', appointment: 'apt-7', customer: 'cust-7', provider: '3', service: '3-2', rating: 4, comment: 'Great yoga classes! Just wish they had more evening time slots.', createdAt: '2026-06-10T10:00:00Z', updatedAt: '2026-06-10T10:00:00Z' },
  'r-4-1': { _id: 'r-4-1', appointment: 'apt-8', customer: 'cust-4', provider: '4', service: '4-3', rating: 5, comment: 'Excellent legal advice. Helped me structure my business perfectly.', createdAt: '2026-06-12T10:00:00Z', updatedAt: '2026-06-12T10:00:00Z' },
  'r-4-2': { _id: 'r-4-2', appointment: 'apt-9', customer: 'cust-5', provider: '4', service: '4-2', rating: 4, comment: 'Thorough contract review. A bit expensive but very professional.', createdAt: '2026-06-05T10:00:00Z', updatedAt: '2026-06-05T10:00:00Z' },
  'r-5-1': { _id: 'r-5-1', appointment: 'apt-10', customer: 'cust-1', provider: '5', service: '5-1', rating: 5, comment: 'My daughter\'s grades improved dramatically after just a few sessions!', createdAt: '2026-06-20T10:00:00Z', updatedAt: '2026-06-20T10:00:00Z' },
  'r-6-1': { _id: 'r-6-1', appointment: 'apt-11', customer: 'cust-2', provider: '6', service: '6-1', rating: 5, comment: 'Honest mechanics who don\'t try to upsell unnecessary services. Highly recommend!', createdAt: '2026-06-18T10:00:00Z', updatedAt: '2026-06-18T10:00:00Z' },
  'r-6-2': { _id: 'r-6-2', appointment: 'apt-12', customer: 'cust-3', provider: '6', service: '6-2', rating: 4, comment: 'Good service, but had to wait a bit longer than expected.', createdAt: '2026-06-08T10:00:00Z', updatedAt: '2026-06-08T10:00:00Z' },
};

export const MOCK_PROVIDERS: PublicProvider[] = Object.keys(users).map(id => ({
  user: users[id],
  profile: profiles[id],
  services: Object.values(services).filter(s => s.provider === id),
  reviews: Object.values(reviews).filter(r => r.provider === id),
}));

export function getProviderById(id: string): PublicProvider | undefined {
  return MOCK_PROVIDERS.find(p => p.user._id === id);
}

export function getServiceById(providerId: string, serviceId: string): Service | undefined {
  const provider = getProviderById(providerId);
  return provider?.services.find(s => s._id === serviceId);
}
