import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const booleanPattern = /^(true|false)$/;

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const formatValidationError = (error) => {
  const validationError = createError("Validation failed", 400);
  validationError.errors = error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message
  }));
  return validationError;
};

const validate = (target, schema) => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true,
    errors: { wrap: { label: false } }
  });

  if (error) {
    return next(formatValidationError(error));
  }

  req[target] = value;
  next();
};

export const validateParams = (schema) => validate("params", schema);
export const validateQuery = (schema) => validate("query", schema);
export const validateBody = (schema) => validate("body", schema);

export const idParamSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required()
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().max(100).allow(""),
  role: Joi.string().valid("customer", "provider", "admin"),
  status: Joi.string().valid("active", "inactive", "pending_payment", "confirmed", "rejected", "cancelled", "completed", "pending", "paid", "failed", "refunded", "visible", "hidden", "flagged"),
  verified: Joi.string().pattern(booleanPattern),
  provider: Joi.string().pattern(objectIdPattern),
  customer: Joi.string().pattern(objectIdPattern),
  rating: Joi.number().integer().min(1).max(5),
  date: Joi.string().trim().max(20),
  from: Joi.string().trim().max(30),
  to: Joi.string().trim().max(30)
});

export const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
});

export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid("customer", "provider", "admin").required()
});

export const updateProviderVerifySchema = Joi.object({
  isVerified: Joi.boolean().required()
});

export const updateProviderStatusSchema = Joi.object({
  isActive: Joi.boolean().required()
});

export const updateReviewStatusSchema = Joi.object({
  moderationStatus: Joi.string().valid("visible", "hidden", "flagged").required()
});
