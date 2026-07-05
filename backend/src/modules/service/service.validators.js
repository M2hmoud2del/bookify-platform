import Joi from "joi";

export const createServiceSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().allow("").optional(),
  category: Joi.string().trim().allow("").optional(),
  price: Joi.number().min(0).required(),
  durationMinutes: Joi.number().integer().min(1).required(),
  images: Joi.array().items(Joi.string().trim().uri()).optional(),
  isActive: Joi.boolean().optional()
});

export const updateServiceSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().allow("").optional(),
  category: Joi.string().trim().allow("").optional(),
  price: Joi.number().min(0).optional(),
  durationMinutes: Joi.number().integer().min(1).optional(),
  images: Joi.array().items(Joi.string().trim().uri()).optional()
}).min(1);

export const updateServiceStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
});
