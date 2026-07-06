import mongoose from "mongoose";

import Appointment from "../../models/Appointment.js";
import ProviderProfile from "../../models/ProviderProfile.js";
import Service from "../../models/Service.js";
import { blockingAppointmentStatuses } from "./appointment.validators.js";

export const createAppointment = (data) => {
  return Appointment.create(data);
};

export const findAppointmentById = (id) => {
  return Appointment.findById(id)
    .populate("customer", "name email phone role")
    .populate("provider", "name email phone role")
    .populate("service", "title price durationMinutes category");
};

export const findServiceById = (serviceId) => {
  return Service.findOne({
    _id: serviceId,
    deletedAt: null
  });
};

export const findProviderProfileByUserId = (providerId) => {
  return ProviderProfile.findOne({
    user: providerId,
    deletedAt: null
  });
};

const buildAppointmentFilters = (baseFilter, filters = {}) => {
  const query = { ...baseFilter };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.date) {
    query.localDate = filters.date;
  }

  if (filters.from || filters.to) {
    query.localDate = {};

    if (filters.from) {
      query.localDate.$gte = filters.from;
    }

    if (filters.to) {
      query.localDate.$lte = filters.to;
    }
  }

  return query;
};

export const findCustomerAppointments = (customerId, filters = {}) => {
  return Appointment.find(buildAppointmentFilters({ customer: customerId }, filters))
    .populate("provider", "name email phone role")
    .populate("service", "title price durationMinutes category")
    .sort({ localDate: 1, startTime: 1 });
};

export const findProviderAppointments = (providerId, filters = {}) => {
  return Appointment.find(buildAppointmentFilters({ provider: providerId }, filters))
    .populate("customer", "name email phone role")
    .populate("service", "title price durationMinutes category")
    .sort({ localDate: 1, startTime: 1 });
};

export const findBlockingAppointments = (
  providerId,
  localDate,
  statuses = blockingAppointmentStatuses
) => {
  return Appointment.find({
    provider: providerId,
    localDate,
    status: mongoose.trusted({ $in: statuses })
  });
};

export const updateAppointmentStatus = (id, updateData) => {
  return Appointment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  })
    .populate("customer", "name email phone role")
    .populate("provider", "name email phone role")
    .populate("service", "title price durationMinutes category");
};
