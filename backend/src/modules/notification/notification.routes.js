import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import * as notificationController from "./notification.controller.js";

const router = Router();

router.get("/my", authMiddleware, notificationController.getMyNotifications);

export default router;
