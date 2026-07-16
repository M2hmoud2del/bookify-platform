import {
  createReview as createReviewService,
  deleteReview as deleteReviewService,
  getMyReviews as getMyReviewsService,
  getProviderReviews as getProviderReviewsService,
  updateReview as updateReviewService
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

export const updateReview = async (req, res, next) => {
  try {
    const result = await updateReviewService(req.user._id, req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const result = await deleteReviewService(req.user._id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
