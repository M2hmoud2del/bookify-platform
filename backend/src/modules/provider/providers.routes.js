import { Router } from "express";

import * as providerController from "./provider.controller.js";

const router = Router();

router.get("/", providerController.getProviders);
router.get("/:id/services", providerController.getProviderServices);
router.get("/:id", providerController.getProviderById);

export default router;
