import {
  getProviderDashboard as getProviderDashboardService
} from "./dashboard.service.js";

export const getProviderDashboard = async (req, res, next) => {
  try {
    const result = await getProviderDashboardService(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
