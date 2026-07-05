import {
  getProfile as getProfileService,
  getProviderById as getProviderByIdService,
  getProviderServices as getProviderServicesService,
  getProviders as getProvidersService,
  updateProfile as updateProfileService
} from "./provider.service.js";

export const getProfile = async (req, res, next) => {
  try {
    const result = await getProfileService(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const result = await updateProfileService(req.user._id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getProviders = async (req, res, next) => {
  try {
    const result = await getProvidersService(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getProviderById = async (req, res, next) => {
  try {
    const result = await getProviderByIdService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getProviderServices = async (req, res, next) => {
  try {
    const result = await getProviderServicesService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
