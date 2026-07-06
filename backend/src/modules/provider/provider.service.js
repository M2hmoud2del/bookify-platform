import mongoose from "mongoose";

import ProviderProfile from "../../models/ProviderProfile.js";
import Service from "../../models/Service.js";
import { upsertWorkingHours } from "../workingHours/workingHours.repository.js";
import { daysOfWeek } from "../workingHours/workingHours.validators.js";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id, message = "Invalid id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(message, 400);
  }
};

const normalizeProfileImage = (profileData) => {
  if (typeof profileData.profileImage === "string") {
    return {
      ...profileData,
      profileImage: {
        url: profileData.profileImage,
        publicId: "",
        moderationStatus: "approved"
      }
    };
  }

  return profileData;
};

const createDefaultClosedWorkingHours = async (providerId) => {
  const closedWeek = daysOfWeek.map((dayOfWeek) => ({
    dayOfWeek,
    startTime: null,
    endTime: null,
    isClosed: true,
    slotIntervalMinutes: 30,
    breaks: []
  }));

  await upsertWorkingHours(providerId, closedWeek);
};

export const getProfile = async (userId) => {
  const profile = await ProviderProfile.findOne({
    user: userId,
    deletedAt: null
  }).populate("user", "name email phone avatar role");

  if (!profile) {
    throw createError("Provider profile not found", 404);
  }

  return {
    success: true,
    profile
  };
};

export const updateProfile = async (userId, profileData) => {
  const normalizedProfileData = normalizeProfileImage(profileData);
  const existingProfile = await ProviderProfile.findOne({ user: userId });

  if (!existingProfile && !normalizedProfileData.businessName) {
    throw createError("Business name is required to create provider profile", 400);
  }

  const profile = await ProviderProfile.findOneAndUpdate(
    { user: userId },
    {
      ...normalizedProfileData,
      user: userId,
      deletedAt: null
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  ).populate("user", "name email phone avatar role");

  if (!existingProfile) {
    await createDefaultClosedWorkingHours(userId);
  }

  return {
    success: true,
    message: "Provider profile saved successfully",
    profile
  };
};

export const getProviders = async (filters = {}) => {
  const query = { deletedAt: null };

  if (filters.city) {
    query.city = new RegExp(filters.city, "i");
  }

  if (filters.category) {
    query.category = new RegExp(filters.category, "i");
  }

  if (filters.search) {
    query.$or = [
      { businessName: new RegExp(filters.search, "i") },
      { bio: new RegExp(filters.search, "i") },
      { category: new RegExp(filters.search, "i") },
      { city: new RegExp(filters.search, "i") }
    ];
  }

  const providers = await ProviderProfile.find(query)
    .populate("user", "name email phone avatar role")
    .sort({ ratingAverage: -1, createdAt: -1 });

  return {
    success: true,
    count: providers.length,
    providers
  };
};

export const getProviderById = async (id) => {
  validateObjectId(id, "Invalid provider id");

  const provider = await ProviderProfile.findOne({
    _id: id,
    deletedAt: null
  }).populate("user", "name email phone avatar role");

  if (!provider) {
    throw createError("Provider not found", 404);
  }

  return {
    success: true,
    provider
  };
};

export const getProviderServices = async (providerProfileId) => {
  validateObjectId(providerProfileId, "Invalid provider id");

  const provider = await ProviderProfile.findOne({
    _id: providerProfileId,
    deletedAt: null
  });

  if (!provider) {
    throw createError("Provider not found", 404);
  }

  const services = await Service.find({
    provider: provider.user,
    isActive: true,
    deletedAt: null
  }).sort({ createdAt: -1 });

  return {
    success: true,
    count: services.length,
    services
  };
};
