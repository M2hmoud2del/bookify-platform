import {
  getMyWorkingHours as getMyWorkingHoursService,
  getProviderWorkingHours as getProviderWorkingHoursService,
  updateMyWorkingHours as updateMyWorkingHoursService
} from "./workingHours.service.js";

export const getMyWorkingHours = async (req, res, next) => {
  try {
    const result = await getMyWorkingHoursService(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateMyWorkingHours = async (req, res, next) => {
  try {
    const result = await updateMyWorkingHoursService(req.user._id, req.body.workingHours);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getProviderWorkingHours = async (req, res, next) => {
  try {
    const result = await getProviderWorkingHoursService(req.params.providerId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
