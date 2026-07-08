import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import validateMiddleware from "../../middleware/validate.middleware.js";
import * as paymentController from "./payment.controller.js";
import { createCheckoutSessionSchema } from "./payment.validators.js";

const router = Router();

router.post(
  "/create-checkout-session",
  authMiddleware,
  authorizeMiddleware("customer"),
  requireJsonMiddleware,
  validateMiddleware(createCheckoutSessionSchema),
  paymentController.createCheckoutSession
);

router.get(
  "/my",
  authMiddleware,
  authorizeMiddleware("customer", "provider"),
  paymentController.getMyPayments
);

export default router;
