import {
  createReview as createReviewService,
  getMyReviews as getMyReviewsService,
  getProviderReviews as getProviderReviewsService
} from "./review.service.js";

export const createReview = async (req, res, next) => {
  try {
    const result = await createReviewService(req.user._id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getProviderReviews = async (req, res, next) => {
  try {
    const result = await getProviderReviewsService(req.params.providerId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMyReviews = async (req, res, next) => {
  try {
    const result = await getMyReviewsService(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
