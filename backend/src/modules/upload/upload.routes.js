import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import {
  uploadProviderProfileImage,
  uploadServiceImages
} from "../../middleware/upload.js";
import validateMiddleware from "../../middleware/validate.middleware.js";
import * as uploadController from "./upload.controller.js";
import { deleteServiceImageSchema } from "./upload.validators.js";

const router = Router();

router.patch(
  "/provider/profile-image",
  authMiddleware,
  authorizeMiddleware("provider"),
  uploadProviderProfileImage,
  uploadController.uploadProviderProfileImage
);

router.post(
  "/services/:serviceId/images",
  authMiddleware,
  authorizeMiddleware("provider"),
  uploadServiceImages,
  uploadController.uploadServiceImages
);

router.delete(
  "/services/:serviceId/images",
  authMiddleware,
  authorizeMiddleware("provider"),
  requireJsonMiddleware,
  validateMiddleware(deleteServiceImageSchema),
  uploadController.deleteServiceImage
);

export default router;
