import { Router } from "express";
import passport from "../../integrations/OAuth/google/passport.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import validateMiddleware from "../../middleware/validate.middleware.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import { registerSchema, loginSchema, updateProfileSchema } from "./auth.validators.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register",requireJsonMiddleware, validateMiddleware(registerSchema), authController.register);
router.post("/login", requireJsonMiddleware, validateMiddleware(loginSchema), authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.put("/profile", authMiddleware, requireJsonMiddleware, validateMiddleware(updateProfileSchema), authController.updateProfile);
router.get("/google", (req, res, next) => {
  const role = req.query.role === "provider" ? "provider" : "customer";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: role
  })(req, res, next);
});
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/google/failure",
    session: false
  }),
  authController.googleCallback
);
router.get("/google/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google login failed"
  });
});

export default router;
