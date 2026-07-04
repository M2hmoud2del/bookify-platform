import { Router } from "express";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import validateMiddleware from "../../middleware/validate.middleware.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "./auth.validators.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register",requireJsonMiddleware, validateMiddleware(registerSchema), authController.register);
router.post("/login", requireJsonMiddleware, validateMiddleware(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.getMe);

export default router;