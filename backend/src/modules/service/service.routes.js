import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import validateMiddleware from "../../middleware/validate.middleware.js";

import {
  createServiceSchema,
  updateServiceSchema,
  updateServiceStatusSchema
} from "./service.validators.js";
import * as serviceController from "./service.controller.js";

const router = Router();

router.get("/", serviceController.getServices);
router.get("/:id", serviceController.getServiceById);

router.post(
  "/",
  authMiddleware,
  authorizeMiddleware("provider"),
  requireJsonMiddleware,
  validateMiddleware(createServiceSchema),
  serviceController.createService
);

router.put(
  "/:id",
  authMiddleware,
  authorizeMiddleware("provider"),
  requireJsonMiddleware,
  validateMiddleware(updateServiceSchema),
  serviceController.updateService
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeMiddleware("provider"),
  serviceController.deleteService
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizeMiddleware("provider"),
  requireJsonMiddleware,
  validateMiddleware(updateServiceStatusSchema),
  serviceController.updateServiceStatus
);

export default router;
