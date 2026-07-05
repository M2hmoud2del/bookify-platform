import {
  createService as createServiceService,
  deleteService as deleteServiceService,
  getServiceById as getServiceByIdService,
  getServices as getServicesService,
  updateService as updateServiceService,
  updateServiceStatus as updateServiceStatusService
} from "./service.service.js";

export const createService = async (req, res, next) => {
  try {
    const result = await createServiceService(req.user._id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const result = await getServicesService(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const result = await getServiceByIdService(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const result = await updateServiceService(req.params.id, req.user._id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const result = await deleteServiceService(req.params.id, req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateServiceStatus = async (req, res, next) => {
  try {
    const result = await updateServiceStatusService(
      req.params.id,
      req.user._id,
      req.body.isActive
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
