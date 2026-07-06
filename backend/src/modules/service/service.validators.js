import Joi from "joi";

export const createServiceSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().allow("").optional(),
  category: Joi.string().trim().allow("").optional(),
  price: Joi.number().min(0).required(),
  durationMinutes: Joi.number().integer().min(1).required(),
  images: Joi.array().items(
    Joi.alternatives().try(
      Joi.string().trim().uri(),
      Joi.object({
        url: Joi.string().trim().uri().required(),
        publicId: Joi.string().trim().required(),
        width: Joi.number().min(0).optional(),
        height: Joi.number().min(0).optional(),
        format: Joi.string().trim().allow("").optional(),
        bytes: Joi.number().min(0).optional(),
        moderationStatus: Joi.string().valid("pending_review", "approved", "rejected").optional()
      })
    )
  ).optional(),
  isActive: Joi.boolean().optional()
});

export const updateServiceSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().allow("").optional(),
  category: Joi.string().trim().allow("").optional(),
  price: Joi.number().min(0).optional(),
  durationMinutes: Joi.number().integer().min(1).optional(),
  images: Joi.array().items(
    Joi.alternatives().try(
      Joi.string().trim().uri(),
      Joi.object({
        url: Joi.string().trim().uri().required(),
        publicId: Joi.string().trim().required(),
        width: Joi.number().min(0).optional(),
        height: Joi.number().min(0).optional(),
        format: Joi.string().trim().allow("").optional(),
        bytes: Joi.number().min(0).optional(),
        moderationStatus: Joi.string().valid("pending_review", "approved", "rejected").optional()
      })
    )
  ).optional()
}).min(1);

export const updateServiceStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
});
