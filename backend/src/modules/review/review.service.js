import mongoose from "mongoose";

import { createReviewError } from "./review.errors.js";
import {
  calculateProviderAverageRating,
  createReview as createReviewRecord,
  findAppointmentById,
  findReviewByAppointment,
  findReviewsByCustomer,
  findReviewsByProvider,
  updateProviderRating
} from "./review.repository.js";

const validateObjectId = (id, message = "Invalid id") => {
  if (!mongoose.Types.ObjectId.isValid(String(id))) {
    throw createReviewError(message, 400);
  }
};

const buildRepository = (dependencies = {}) =>
  dependencies.repository || {
    createReview: createReviewRecord,
    findAppointmentById,
    findReviewByAppointment,
    findReviewsByCustomer,
    findReviewsByProvider,
    calculateProviderAverageRating,
    updateProviderRating
  };

export const createReview = async (customerId, payload, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const { appointmentId, rating, comment } = payload;

  validateObjectId(appointmentId, "Invalid appointmentId");

  const appointment = await repository.findAppointmentById(appointmentId);

  if (!appointment) {
    throw createReviewError("Appointment not found", 404);
  }

  if (String(appointment.customer?._id || appointment.customer) !== String(customerId)) {
    throw createReviewError("Forbidden: You can only review your own appointments", 403);
  }

  if (appointment.status !== "completed") {
    throw createReviewError("You can only review completed appointments", 400);
  }

  const existingReview = await repository.findReviewByAppointment(appointmentId);

  if (existingReview) {
    throw createReviewError("You have already reviewed this appointment", 409);
  }

  const providerId = appointment.provider?._id || appointment.provider;
  const serviceId = appointment.service?._id || appointment.service;

  const review = await repository.createReview({
    appointment: appointmentId,
    customer: customerId,
    provider: providerId,
    service: serviceId,
    rating,
    comment
  });

  const { averageRating, totalReviews } = await repository.calculateProviderAverageRating(providerId);
  await repository.updateProviderRating(providerId, averageRating, totalReviews);

  return {
    success: true,
    message: "Review created successfully",
    data: { review }
  };
};

export const getProviderReviews = async (providerId, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  validateObjectId(providerId, "Invalid providerId");

  const reviews = await repository.findReviewsByProvider(providerId);

  const { averageRating, totalReviews } = await repository.calculateProviderAverageRating(providerId);

  return {
    success: true,
    message: "Provider reviews retrieved successfully",
    data: {
      reviews,
      averageRating,
      totalReviews
    }
  };
};

export const getMyReviews = async (customerId, dependencies = {}) => {
  const repository = buildRepository(dependencies);
  const reviews = await repository.findReviewsByCustomer(customerId);

  return {
    success: true,
    message: "My reviews retrieved successfully",
    data: { reviews }
  };
};
