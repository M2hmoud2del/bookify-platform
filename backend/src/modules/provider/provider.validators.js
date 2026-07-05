import Joi from "joi";

export const updateProfileSchema = Joi.object({
  businessName: Joi.string().trim().optional(),
  bio: Joi.string().trim().allow("").optional(),
  category: Joi.string().trim().allow("").optional(),
  address: Joi.string().trim().allow("").optional(),
  city: Joi.string().trim().allow("").optional(),
  profileImage: Joi.string().trim().uri().allow("").optional(),
  timezone: Joi.string().trim().optional()
}).min(1);
