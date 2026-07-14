import {
  getAdminDashboard as getAdminDashboardService,
  getAppointmentById as getAppointmentByIdService,
  getAppointments as getAppointmentsService,
  getPaymentById as getPaymentByIdService,
  getPayments as getPaymentsService,
  getProviderById as getProviderByIdService,
  getProviders as getProvidersService,
  getReviews as getReviewsService,
  getUserById as getUserByIdService,
  getUsers as getUsersService,
  updateProviderStatus as updateProviderStatusService,
  updateProviderVerification as updateProviderVerificationService,
  updateReviewStatus as updateReviewStatusService,
  updateUserRole as updateUserRoleService,
  updateUserStatus as updateUserStatusService
} from "./admin.service.js";

export const getUsers = async (req, res, next) => {
  try {
    res.status(200).json(await getUsersService(req.query));
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    res.status(200).json(await getUserByIdService(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    res.status(200).json(await updateUserStatusService(req.user._id, req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    res.status(200).json(await updateUserRoleService(req.user._id, req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

export const getProviders = async (req, res, next) => {
  try {
    res.status(200).json(await getProvidersService(req.query));
  } catch (err) {
    next(err);
  }
};

export const getProviderById = async (req, res, next) => {
  try {
    res.status(200).json(await getProviderByIdService(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const updateProviderVerification = async (req, res, next) => {
  try {
    res.status(200).json(await updateProviderVerificationService(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

export const updateProviderStatus = async (req, res, next) => {
  try {
    res.status(200).json(await updateProviderStatusService(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    res.status(200).json(await getAppointmentsService(req.query));
  } catch (err) {
    next(err);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    res.status(200).json(await getAppointmentByIdService(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    res.status(200).json(await getPaymentsService(req.query));
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    res.status(200).json(await getPaymentByIdService(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    res.status(200).json(await getReviewsService(req.query));
  } catch (err) {
    next(err);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    res.status(200).json(await updateReviewStatusService(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

export const getAdminDashboard = async (req, res, next) => {
  try {
    res.status(200).json(await getAdminDashboardService());
  } catch (err) {
    next(err);
  }
};
