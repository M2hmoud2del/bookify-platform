import { getAvailability as getAvailabilityService } from "./availability.service.js";

export const getAvailability = async (req, res, next) => {
  try {
    const result = await getAvailabilityService(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
