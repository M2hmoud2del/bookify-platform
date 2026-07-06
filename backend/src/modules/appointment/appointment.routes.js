import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import validateMiddleware from "../../middleware/validate.middleware.js";
import * as appointmentController from "./appointment.controller.js";
import {
  appointmentReasonSchema,
  createAppointmentSchema
} from "./appointment.validators.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeMiddleware("customer"),
  requireJsonMiddleware,
  validateMiddleware(createAppointmentSchema),
  appointmentController.createAppointment
);

router.get(
  "/my",
  authMiddleware,
  authorizeMiddleware("customer"),
  appointmentController.getMyAppointments
);

router.get(
  "/provider",
  authMiddleware,
  authorizeMiddleware("provider"),
  appointmentController.getProviderAppointments
);

router.get(
  "/:id",
  authMiddleware,
  authorizeMiddleware("customer", "provider", "admin"),
  appointmentController.getAppointmentById
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  authorizeMiddleware("customer", "provider"),
  requireJsonMiddleware,
  validateMiddleware(appointmentReasonSchema),
  appointmentController.cancelAppointment
);

router.patch(
  "/:id/reject",
  authMiddleware,
  authorizeMiddleware("provider"),
  requireJsonMiddleware,
  validateMiddleware(appointmentReasonSchema),
  appointmentController.rejectAppointment
);

router.patch(
  "/:id/complete",
  authMiddleware,
  authorizeMiddleware("provider"),
  appointmentController.completeAppointment
);

router.patch(
  "/:id/accept",
  authMiddleware,
  authorizeMiddleware("provider"),
  appointmentController.acceptAppointment
);

export default router;
