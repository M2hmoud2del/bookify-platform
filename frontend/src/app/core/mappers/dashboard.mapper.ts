import { mapBackendAppointments } from './appointment.mapper';
import { mapBackendReviews } from './review.mapper';
import { BackendAppointment } from '../models/appointment.model';
import { BackendDashboardMetrics, DashboardMetrics } from '../models/dashboard.model';
import { BackendReview } from '../models/review.model';

export function mapBackendDashboard(input: unknown): DashboardMetrics {
  const dashboard = extractDashboard(input);
  const nested = dashboard.dashboard || dashboard.stats || dashboard.metrics || {};
  const merged = { ...nested, ...dashboard } as BackendDashboardMetrics;
  const appointmentStats = merged.appointmentStats || {};
  const todayAppointments = arrayValue<BackendAppointment>(merged.todayAppointments);
  const upcomingAppointments = arrayValue<BackendAppointment>(merged.upcomingAppointments);
  const recentAppointments = arrayValue<BackendAppointment>(merged.recentAppointments);
  const recentReviews = arrayValue<BackendReview>(merged.recentReviews);

  const pendingAppointments = numberValue(
    merged.pendingAppointments ?? appointmentStats['pending_payment'] ?? appointmentStats['pending']
  );
  const completedAppointments = numberValue(merged.completedAppointments ?? appointmentStats['completed']);
  const cancelledAppointments = numberValue(merged.cancelledAppointments ?? appointmentStats['cancelled']);
  const totalAppointments = numberValue(
    merged.totalAppointments ?? appointmentStats['total'] ?? pendingAppointments + completedAppointments + cancelledAppointments + numberValue(appointmentStats['confirmed'])
  );

  return {
    totalAppointments,
    todayAppointments: numberValue(typeof merged.todayAppointments === 'number' ? merged.todayAppointments : todayAppointments.length),
    upcomingAppointments: numberValue(typeof merged.upcomingAppointments === 'number' ? merged.upcomingAppointments : upcomingAppointments.length),
    completedAppointments,
    cancelledAppointments,
    pendingAppointments,
    totalRevenue: numberValue(merged.totalRevenue ?? merged.revenue?.total?.totalRevenue),
    monthlyRevenue: numberValue(merged.monthlyRevenue ?? merged.revenue?.monthly?.totalRevenue),
    averageRating: numberValue(merged.averageRating ?? merged.rating?.averageRating),
    totalReviews: numberValue(merged.totalReviews ?? merged.rating?.totalReviews),
    activeServices: numberValue(merged.activeServices),
    totalCustomers: numberValue(merged.customerStats?.uniqueCustomers),
    todayAppointmentList: mapBackendAppointments(todayAppointments),
    upcomingAppointmentList: mapBackendAppointments(upcomingAppointments),
    recentAppointments: mapBackendAppointments(recentAppointments),
    recentReviews: mapBackendReviews(recentReviews),
  };
}

function extractDashboard(input: unknown): BackendDashboardMetrics {
  const body = input as { data?: unknown; dashboard?: unknown; stats?: unknown; metrics?: unknown };
  const payload = (body?.data || body?.dashboard || body?.stats || body?.metrics || body) as BackendDashboardMetrics;
  return payload || {};
}

function arrayValue<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

function numberValue(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
