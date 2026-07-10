import { getMyNotifications as getMyNotificationsService } from "./notification.service.js";

export const getMyNotifications = async (req, res, next) => {
  try {
    const result = await getMyNotificationsService(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
