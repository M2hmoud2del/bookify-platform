import ProviderProfile from "../../models/ProviderProfile.js";
import Service from "../../models/Service.js";

export const findProviderProfileByUserId = (userId) => {
  return ProviderProfile.findOne({
    user: userId,
    deletedAt: null
  });
};

export const findOwnedServiceById = (serviceId, providerId) => {
  return Service.findOne({
    _id: serviceId,
    provider: providerId,
    deletedAt: null
  });
};

export const saveDocument = (document) => {
  return document.save();
};
