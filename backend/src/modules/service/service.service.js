import mongoose from "mongoose";

import Service from "../../models/Service.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id, message = "Invalid service id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(message, 400);
  }
};

const getProviderService = async (serviceId, providerId) => {
  validateObjectId(serviceId);

  const service = await Service.findOne({
    _id: serviceId,
    provider: providerId,
    deletedAt: null
  });

  if (!service) {
    throw createError("Service not found", 404);
  }

  return service;
};

const normalizeImages = (serviceData) => {
  if (!Array.isArray(serviceData.images)) {
    return serviceData;
  }

  return {
    ...serviceData,
    images: serviceData.images.map((image) => {
      if (typeof image === "string") {
        return {
          url: image,
          publicId: "",
          moderationStatus: "approved"
        };
      }

      return image;
    })
  };
};

export const createService = async (providerId, serviceData) => {
  const normalizedServiceData = normalizeImages(serviceData);

  const service = await Service.create({
    ...normalizedServiceData,
    provider: providerId
  });

  return {
    success: true,
    message: "Service created successfully",
    service
  };
};

export const getServices = async (filters = {}) => {
  const query = {
    isActive: true,
    deletedAt: null
  };

  if (filters.category) {
    query.category = new RegExp(filters.category, "i");
  }

  if (filters.search) {
    query.$or = [
      { title: new RegExp(filters.search, "i") },
      { description: new RegExp(filters.search, "i") },
      { category: new RegExp(filters.search, "i") }
    ];
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};

    if (filters.minPrice) {
      const minPrice = Number(filters.minPrice);

      if (Number.isNaN(minPrice)) {
        throw createError("minPrice must be a number", 400);
      }

      query.price.$gte = minPrice;
    }

    if (filters.maxPrice) {
      const maxPrice = Number(filters.maxPrice);

      if (Number.isNaN(maxPrice)) {
        throw createError("maxPrice must be a number", 400);
      }

      query.price.$lte = maxPrice;
    }
  }

  const services = await Service.find(query)
    .populate("provider", "name email phone avatar role")
    .sort({ createdAt: -1 });

  return {
    success: true,
    count: services.length,
    services
  };
};

export const getServiceById = async (id) => {
  validateObjectId(id);

  const service = await Service.findOne({
    _id: id,
    isActive: true,
    deletedAt: null
  }).populate("provider", "name email phone avatar role");

  if (!service) {
    throw createError("Service not found", 404);
  }

  return {
    success: true,
    service
  };
};

export const updateService = async (serviceId, providerId, serviceData) => {
  const service = await getProviderService(serviceId, providerId);
  const normalizedServiceData = normalizeImages(serviceData);

  Object.assign(service, normalizedServiceData);
  await service.save();

  return {
    success: true,
    message: "Service updated successfully",
    service
  };
};

export const deleteService = async (serviceId, providerId) => {
  const service = await getProviderService(serviceId, providerId);

  service.deletedAt = new Date();
  service.isActive = false;
  await service.save();

  return {
    success: true,
    message: "Service deleted successfully"
  };
};

export const updateServiceStatus = async (serviceId, providerId, isActive) => {
  const service = await getProviderService(serviceId, providerId);

  service.isActive = isActive;
  await service.save();

  return {
    success: true,
    message: "Service status updated successfully",
    service
  };
};
