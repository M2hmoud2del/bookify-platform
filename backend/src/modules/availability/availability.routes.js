import { Router } from "express";

import * as availabilityController from "./availability.controller.js";

const router = Router();

router.get("/", availabilityController.getAvailability);

export default router;
