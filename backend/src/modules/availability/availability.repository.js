import mongoose from "mongoose";

import Appointment from "../../models/Appointment.js";
import ProviderProfile from "../../models/ProviderProfile.js";
import Service from "../../models/Service.js";
import WorkingHour from "../../models/WorkingHour.js";

const activeAppointmentStatuses = ["pending_payment", "confirmed"];

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

export const findWorkingHourByProviderAndDay = (providerId, dayOfWeek) => {
  return WorkingHour.findOne({
    provider: providerId,
    dayOfWeek
  });
};

export const findActiveAppointmentsForDate = (providerId, serviceId, dateStart, dateEnd) => {
  return Appointment.find({
    provider: providerId,
    service: serviceId,
    date: mongoose.trusted({
      $gte: dateStart,
      $lt: dateEnd
    }),
    status: mongoose.trusted({
      $in: activeAppointmentStatuses
    })
  });
};
