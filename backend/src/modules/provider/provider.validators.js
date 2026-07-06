import Joi from "joi";

export const updateProfileSchema = Joi.object({
  businessName: Joi.string().trim().optional(),
  bio: Joi.string().trim().allow("").optional(),
  category: Joi.string().trim().allow("").optional(),
  address: Joi.string().trim().allow("").optional(),
  city: Joi.string().trim().allow("").optional(),
  profileImage: Joi.alternatives().try(
    Joi.string().trim().uri().allow(""),
    Joi.object({
      url: Joi.string().trim().uri().allow("").optional(),
      publicId: Joi.string().trim().allow("").optional(),
      width: Joi.number().min(0).optional(),
      height: Joi.number().min(0).optional(),
      format: Joi.string().trim().allow("").optional(),
      bytes: Joi.number().min(0).optional(),
      moderationStatus: Joi.string().valid("pending_review", "approved", "rejected").optional()
    })
  ).optional(),
  timezone: Joi.string().trim().optional()
}).min(1);
