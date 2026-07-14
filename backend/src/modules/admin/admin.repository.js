import mongoose from "mongoose";

import Appointment from "../../models/Appointment.js";
import Payment from "../../models/Payment.js";
import ProviderProfile from "../../models/ProviderProfile.js";
import Review from "../../models/Review.js";
import User from "../../models/User.js";

const userSelect = "name email role phone avatar isActive deletedAt createdAt updatedAt";
const safeUserPopulate = { path: "user", select: userSelect };
const appointmentPopulate = [
  { path: "customer", select: userSelect },
  { path: "provider", select: userSelect },
  { path: "service", select: "title price durationMinutes category" }
];
const paymentPopulate = [
  {
    path: "appointment",
    select: "localDate startTime endTime status paymentStatus",
    populate: [{ path: "service", select: "title price durationMinutes category" }]
  },
  { path: "customer", select: userSelect },
  { path: "provider", select: userSelect }
];
const reviewPopulate = [
  { path: "customer", select: userSelect },
  { path: "provider", select: userSelect },
  { path: "service", select: "title category price durationMinutes" }
];

export const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildPagination = ({ page = 1, limit = 20 } = {}) => ({
  page: Number(page),
  limit: Number(limit),
  skip: (Number(page) - 1) * Number(limit)
});

const withPagination = async (model, filter, query, options = {}) => {
  const { page, limit, skip } = buildPagination(query);
  let dbQuery = model.find(filter);

  if (options.select) {
    dbQuery = dbQuery.select(options.select);
  }

  if (options.populate) {
    for (const populate of options.populate) {
      dbQuery = dbQuery.populate(populate);
    }
  }

  const [items, total] = await Promise.all([
    dbQuery.sort(options.sort || { createdAt: -1 }).skip(skip).limit(limit),
    model.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const dateRangeFilter = (query = {}) => {
  if (!query.from && !query.to) {
    return undefined;
  }

  const range = {};

  if (query.from) {
    range.$gte = new Date(query.from);
  }

  if (query.to) {
    range.$lte = new Date(query.to);
  }

  return range;
};

export const findUsers = (query = {}) => {
  const filter = {};

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  if (query.role) {
    filter.role = query.role;
  }

  if (query.status === "active") {
    filter.isActive = true;
  }

  if (query.status === "inactive") {
    filter.isActive = false;
  }

  return withPagination(User, filter, query, { select: userSelect });
};

export const findUserById = (id) => User.findById(id).select(userSelect);

export const updateUserStatus = (id, isActive) =>
  User.findByIdAndUpdate(id, { isActive }, { new: true, runValidators: true }).select(userSelect);

export const updateUserRole = (id, role) =>
  User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select(userSelect);

export const findProviders = (query = {}) => {
  const filter = {};

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ businessName: regex }, { city: regex }, { category: regex }];
  }

  if (query.verified) {
    filter.isVerified = query.verified === "true";
  }

  if (query.status === "active") {
    filter.isActive = true;
  }

  if (query.status === "inactive") {
    filter.isActive = false;
  }

  return withPagination(ProviderProfile, filter, query, { populate: [safeUserPopulate] });
};

export const findProviderById = (id) => ProviderProfile.findById(id).populate(safeUserPopulate);

export const updateProviderVerification = (id, isVerified) =>
  ProviderProfile.findByIdAndUpdate(id, { isVerified }, { new: true, runValidators: true }).populate(safeUserPopulate);

export const updateProviderStatus = (id, isActive) =>
  ProviderProfile.findByIdAndUpdate(id, { isActive }, { new: true, runValidators: true }).populate(safeUserPopulate);

export const findAppointments = (query = {}) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.date) filter.localDate = query.date;
  if (query.provider) filter.provider = query.provider;
  if (query.customer) filter.customer = query.customer;

  return withPagination(Appointment, filter, query, {
    populate: appointmentPopulate,
    sort: { localDate: -1, startTime: -1 }
  });
};

export const findAppointmentById = (id) => Appointment.findById(id).populate(appointmentPopulate);

export const findPayments = (query = {}) => {
  const filter = {};
  const createdAt = dateRangeFilter(query);

  if (query.status) filter.status = query.status;
  if (createdAt) filter.createdAt = createdAt;

  return withPagination(Payment, filter, query, {
    select: "-stripeSessionId -stripePaymentIntentId",
    populate: paymentPopulate
  });
};

export const findPaymentById = (id) =>
  Payment.findById(id).select("-stripeSessionId -stripePaymentIntentId").populate(paymentPopulate);

export const findReviews = (query = {}) => {
  const filter = {};

  if (query.rating) filter.rating = Number(query.rating);
  if (query.status) filter.moderationStatus = query.status;
  if (query.provider) filter.provider = query.provider;

  return withPagination(Review, filter, query, { populate: reviewPopulate });
};

export const findReviewById = (id) => Review.findById(id).populate(reviewPopulate);

export const updateReviewModerationStatus = (id, moderationStatus) =>
  Review.findByIdAndUpdate(id, { moderationStatus }, { new: true, runValidators: true }).populate(reviewPopulate);

export const getAdminMetrics = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    verifiedProviders,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    totalPayments,
    revenueResult,
    reviewStats,
    recentAppointments,
    recentPayments,
    recentReviews
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "provider" }),
    ProviderProfile.countDocuments({ isVerified: true }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "completed" }),
    Appointment.countDocuments({ status: "cancelled" }),
    Payment.countDocuments(),
    Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]),
    Review.aggregate([
      { $group: { _id: null, totalReviews: { $sum: 1 }, averageRating: { $avg: "$rating" } } }
    ]),
    Appointment.find().populate(appointmentPopulate).sort({ createdAt: -1 }).limit(5),
    Payment.find().select("-stripeSessionId -stripePaymentIntentId").populate(paymentPopulate).sort({ createdAt: -1 }).limit(5),
    Review.find().populate(reviewPopulate).sort({ createdAt: -1 }).limit(5)
  ]);

  return {
    totalUsers,
    totalCustomers,
    totalProviders,
    verifiedProviders,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    totalPayments,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
    totalReviews: reviewStats[0]?.totalReviews || 0,
    averageRating: Math.round((reviewStats[0]?.averageRating || 0) * 10) / 10,
    recentAppointments,
    recentPayments,
    recentReviews
  };
};

export const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));
