import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import * as adminController from "./admin.controller.js";
import {
  idParamSchema,
  paginationSchema,
  updateProviderStatusSchema,
  updateProviderVerifySchema,
  updateReviewStatusSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  validateBody,
  validateParams,
  validateQuery
} from "./admin.validation.js";

const router = Router();

router.use(authMiddleware, authorizeMiddleware("admin"));

router.get("/users", validateQuery(paginationSchema), adminController.getUsers);
router.get("/users/:id", validateParams(idParamSchema), adminController.getUserById);
router.patch(
  "/users/:id/status",
  validateParams(idParamSchema),
  requireJsonMiddleware,
  validateBody(updateUserStatusSchema),
  adminController.updateUserStatus
);
router.patch(
  "/users/:id/role",
  validateParams(idParamSchema),
  requireJsonMiddleware,
  validateBody(updateUserRoleSchema),
  adminController.updateUserRole
);

router.get("/providers", validateQuery(paginationSchema), adminController.getProviders);
router.get("/providers/:id", validateParams(idParamSchema), adminController.getProviderById);
router.patch(
  "/providers/:id/verify",
  validateParams(idParamSchema),
  requireJsonMiddleware,
  validateBody(updateProviderVerifySchema),
  adminController.updateProviderVerification
);
router.patch(
  "/providers/:id/status",
  validateParams(idParamSchema),
  requireJsonMiddleware,
  validateBody(updateProviderStatusSchema),
  adminController.updateProviderStatus
);

router.get("/appointments", validateQuery(paginationSchema), adminController.getAppointments);
router.get("/appointments/:id", validateParams(idParamSchema), adminController.getAppointmentById);

router.get("/payments", validateQuery(paginationSchema), adminController.getPayments);
router.get("/payments/:id", validateParams(idParamSchema), adminController.getPaymentById);

router.get("/reviews", validateQuery(paginationSchema), adminController.getReviews);
router.patch(
  "/reviews/:id/status",
  validateParams(idParamSchema),
  requireJsonMiddleware,
  validateBody(updateReviewStatusSchema),
  adminController.updateReviewStatus
);

export default router;
