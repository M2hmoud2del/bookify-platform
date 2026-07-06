import Joi from "joi";

export const deleteServiceImageSchema = Joi.object({
  publicId: Joi.string().trim().required()
});
