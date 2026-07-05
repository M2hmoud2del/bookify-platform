import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import validateMiddleware from "../../middleware/validate.middleware.js";

import { updateProfileSchema } from "./provider.validators.js";
import * as providerController from "./provider.controller.js";

const router = Router();

router.get("/", providerController.getProviders);
router.get("/:id", providerController.getProviderById);

export default router;