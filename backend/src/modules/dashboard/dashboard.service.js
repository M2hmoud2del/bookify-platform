import { createDashboardError } from "./dashboard.errors.js";
import {
  findProviderProfile,
  findTodayAppointments,
  findUpcomingAppointments,
  getAppointmentStatsByStatus,
  getMonthlyRevenue,
  getProviderRating,
  getTotalRevenue,
  getUniqueCustomerCount
} from "./dashboard.repository.js";

const buildRepository = (dependencies = {}) =>
  dependencies.repository || {
    findProviderProfile,
    findTodayAppointments,
    findUpcomingAppointments,
    getAppointmentStatsByStatus,
    getMonthlyRevenue,
    getProviderRating,
    getTotalRevenue,
    getUniqueCustomerCount
  };

const getTodayDateString = (timezone = "UTC") => {
  const now = new Date();

  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });

    return formatter.format(now);
  } catch {
    return now.toISOString().split("T")[0];
  }
};

export const getProviderDashboard = async (providerId, dependencies = {}) => {
  const repository = buildRepository(dependencies);

  const providerProfile = await repository.findProviderProfile(providerId);

  if (!providerProfile) {
    throw createDashboardError("Provider profile not found. Please create a profile first.", 404);
  }

  const timezone = providerProfile.timezone || "UTC";
  const todayDate = getTodayDateString(timezone);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [
    todayAppointments,
    upcomingAppointments,
    appointmentStats,
    monthlyRevenue,
    totalRevenue,
    uniqueCustomers,
    rating
  ] = await Promise.all([
    repository.findTodayAppointments(providerId, todayDate),
    repository.findUpcomingAppointments(providerId, todayDate),
    repository.getAppointmentStatsByStatus(providerId),
    repository.getMonthlyRevenue(providerId, currentYear, currentMonth),
    repository.getTotalRevenue(providerId),
    repository.getUniqueCustomerCount(providerId),
    repository.getProviderRating(providerId)
  ]);

  return {
    success: true,
    message: "Provider dashboard retrieved successfully",
    data: {
      todayAppointments,
      upcomingAppointments,
      appointmentStats,
      revenue: {
        monthly: monthlyRevenue,
        total: totalRevenue
      },
      customerStats: {
        uniqueCustomers
      },
      rating
    }
  };
};
