import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import authorizeMiddleware from "../../middleware/authorize.middleware.js";
import requireJsonMiddleware from "../../middleware/requireJson.middleware.js";
import validateMiddleware from "../../middleware/validate.middleware.js";
import * as reviewController from "./review.controller.js";
import { createReviewSchema, updateReviewSchema } from "./review.validators.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeMiddleware("customer"),
  requireJsonMiddleware,
  validateMiddleware(createReviewSchema),
  reviewController.createReview
);

router.get(
  "/my",
  authMiddleware,
  authorizeMiddleware("customer"),
  reviewController.getMyReviews
);

router.get(
  "/provider/:providerId",
  reviewController.getProviderReviews
);

router.put(
  "/:id",
  authMiddleware,
  authorizeMiddleware("customer"),
  requireJsonMiddleware,
  validateMiddleware(updateReviewSchema),
  reviewController.updateReview
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeMiddleware("customer"),
  reviewController.deleteReview
);

export default router;
