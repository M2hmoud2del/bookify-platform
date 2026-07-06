import {
  acceptAppointment as acceptAppointmentService,
  cancelAppointment as cancelAppointmentService,
  completeAppointment as completeAppointmentService,
  createAppointment as createAppointmentService,
  getAppointmentById as getAppointmentByIdService,
  getMyAppointments as getMyAppointmentsService,
  getProviderAppointments as getProviderAppointmentsService,
  rejectAppointment as rejectAppointmentService
} from "./appointment.service.js";

export const createAppointment = async (req, res, next) => {
  try {
    const result = await createAppointmentService(req.user._id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const result = await getMyAppointmentsService(req.user._id, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getProviderAppointments = async (req, res, next) => {
  try {
    const result = await getProviderAppointmentsService(req.user._id, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const result = await getAppointmentByIdService(req.user, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const result = await cancelAppointmentService(req.user, req.params.id, req.body.reason);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const rejectAppointment = async (req, res, next) => {
  try {
    const result = await rejectAppointmentService(req.user._id, req.params.id, req.body.reason);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const completeAppointment = async (req, res, next) => {
  try {
    const result = await completeAppointmentService(req.user._id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const acceptAppointment = async (req, res, next) => {
  try {
    const result = await acceptAppointmentService(req.user._id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
