import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createReviewSchema = Joi.object({
  appointmentId: Joi.string().pattern(objectIdPattern).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).allow("").optional()
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  comment: Joi.string().trim().max(1000).allow("").optional()
}).min(1);
