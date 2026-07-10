import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import * as dashboardController from "./dashboard.controller.js";

const router = Router();

router.get(
  "/provider",
  authMiddleware,
  authorizeMiddleware("provider"),
  dashboardController.getProviderDashboard
);

export default router;
