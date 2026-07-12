import mongoose from "mongoose";

import Appointment from "../../models/Appointment.js";
import Payment from "../../models/Payment.js";
import ProviderProfile from "../../models/ProviderProfile.js";
import Review from "../../models/Review.js";

export const findProviderProfile = (userId) => {
  return ProviderProfile.findOne({
    user: userId,
    deletedAt: null
  });
};

export const findTodayAppointments = (providerId, todayDate) => {
  return Appointment.find({
    provider: providerId,
    localDate: todayDate,
    status: { $in: ["confirmed", "completed"] }
  })
    .populate("customer", "name email phone")
    .populate("service", "title price durationMinutes category")
    .sort({ startTime: 1 });
};

export const findUpcomingAppointments = (providerId, todayDate) => {
  return Appointment.find({
    provider: providerId,
    localDate: { $gt: todayDate },
    status: "confirmed"
  })
    .populate("customer", "name email phone")
    .populate("service", "title price durationMinutes category")
    .sort({ localDate: 1, startTime: 1 })
    .limit(10);
};

export const getAppointmentStatsByStatus = async (providerId) => {
  const result = await Appointment.aggregate([
    { $match: { provider: new mongoose.Types.ObjectId(String(providerId)) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const stats = {
    pending_payment: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0,
    total: 0
  };

  for (const item of result) {
    stats[item._id] = item.count;
    stats.total += item.count;
  }

  return stats;
};

export const getMonthlyRevenue = async (providerId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const result = await Payment.aggregate([
    {
      $match: {
        provider: new mongoose.Types.ObjectId(String(providerId)),
        status: "paid",
        createdAt: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalPayments: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return { totalRevenue: 0, totalPayments: 0 };
  }

  return {
    totalRevenue: result[0].totalRevenue,
    totalPayments: result[0].totalPayments
  };
};

export const getTotalRevenue = async (providerId) => {
  const result = await Payment.aggregate([
    {
      $match: {
        provider: new mongoose.Types.ObjectId(String(providerId)),
        status: "paid"
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalPayments: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return { totalRevenue: 0, totalPayments: 0 };
  }

  return {
    totalRevenue: result[0].totalRevenue,
    totalPayments: result[0].totalPayments
  };
};

export const getUniqueCustomerCount = async (providerId) => {
  const result = await Appointment.aggregate([
    {
      $match: {
        provider: new mongoose.Types.ObjectId(String(providerId)),
        status: { $in: ["confirmed", "completed"] }
      }
    },
    {
      $group: {
        _id: "$customer"
      }
    },
    {
      $count: "uniqueCustomers"
    }
  ]);

  return result.length > 0 ? result[0].uniqueCustomers : 0;
};

export const getProviderRating = async (providerId) => {
  const result = await Review.aggregate([
    { $match: { provider: new mongoose.Types.ObjectId(String(providerId)) } },
    {
      $group: {
        _id: "$provider",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews
  };
};
