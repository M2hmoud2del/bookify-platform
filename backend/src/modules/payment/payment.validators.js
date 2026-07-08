import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createCheckoutSessionSchema = Joi.object({
  appointmentId: Joi.string().pattern(objectIdPattern).required(),
  successUrl: Joi.string().trim().uri().optional(),
  cancelUrl: Joi.string().trim().uri().optional()
});
