import { BackendAppointment, AppointmentView } from './appointment.model';
import { BackendReview, ReviewView } from './review.model';

export interface BackendDashboardMetrics {
  totalAppointments?: number;
  todayAppointments?: BackendAppointment[] | number;
  upcomingAppointments?: BackendAppointment[] | number;
  completedAppointments?: number;
  cancelledAppointments?: number;
  pendingAppointments?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  averageRating?: number;
  totalReviews?: number;
  activeServices?: number;
  recentAppointments?: BackendAppointment[];
  recentReviews?: BackendReview[];
  appointmentStats?: Record<string, number>;
  revenue?: {
    monthly?: RevenueSummary;
    total?: RevenueSummary;
  };
  customerStats?: {
    uniqueCustomers?: number;
  };
  rating?: {
    averageRating?: number;
    totalReviews?: number;
  };
  stats?: Partial<BackendDashboardMetrics>;
  metrics?: Partial<BackendDashboardMetrics>;
  dashboard?: Partial<BackendDashboardMetrics>;
}

export interface RevenueSummary {
  totalRevenue?: number;
  totalPayments?: number;
}

export interface DashboardMetrics {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  activeServices: number;
  totalCustomers: number;
  todayAppointmentList: AppointmentView[];
  upcomingAppointmentList: AppointmentView[];
  recentAppointments: AppointmentView[];
  recentReviews: ReviewView[];
}
