import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import validateMiddleware from "../../middleware/validate.middleware.js";
import * as workingHoursController from "./workingHours.controller.js";
import { updateWorkingHoursSchema } from "./workingHours.validators.js";

const router = Router();

router.get(
  "/my",
  authMiddleware,
  authorizeMiddleware("provider"),
  workingHoursController.getMyWorkingHours
);

router.put(
  "/my",
  authMiddleware,
  authorizeMiddleware("provider"),
  requireJsonMiddleware,
  validateMiddleware(updateWorkingHoursSchema),
  workingHoursController.updateMyWorkingHours
);

router.get("/provider/:providerId", workingHoursController.getProviderWorkingHours);

export default router;
