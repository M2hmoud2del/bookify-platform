import mongoose from "mongoose";

import Appointment from "../../models/Appointment.js";
import ProviderProfile from "../../models/ProviderProfile.js";
import Review from "../../models/Review.js";

export const findAppointmentById = (appointmentId) => {
  return Appointment.findById(appointmentId)
    .populate("customer", "name email phone role")
    .populate("provider", "name email phone role")
    .populate("service", "title price durationMinutes category");
};

export const findReviewByAppointment = (appointmentId) => {
  return Review.findOne({ appointment: appointmentId });
};

export const createReview = (data) => {
  return Review.create(data);
};

export const findReviewById = (reviewId) => {
  return Review.findById(reviewId)
    .populate("customer", "name email avatar")
    .populate("provider", "name email avatar")
    .populate("service", "title category");
};

export const updateReview = (reviewId, data) => {
  return Review.findByIdAndUpdate(reviewId, data, {
    new: true,
    runValidators: true
  })
    .populate("customer", "name email avatar")
    .populate("provider", "name email avatar")
    .populate("service", "title category");
};

export const deleteReview = (reviewId) => {
  return Review.findByIdAndDelete(reviewId);
};

export const findReviewsByProvider = (providerId) => {
  return Review.find({ provider: providerId })
    .populate("customer", "name email avatar")
    .populate("service", "title category")
    .sort({ createdAt: -1 });
};

export const findReviewsByCustomer = (customerId) => {
  return Review.find({ customer: customerId })
    .populate("provider", "name email avatar")
    .populate("service", "title category")
    .sort({ createdAt: -1 });
};

export const calculateProviderAverageRating = async (providerId) => {
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

export const updateProviderRating = (providerId, ratingAverage, ratingCount) => {
  return ProviderProfile.findOneAndUpdate(
    { user: providerId },
    { ratingAverage, ratingCount },
    { new: true, runValidators: true }
  );
};
