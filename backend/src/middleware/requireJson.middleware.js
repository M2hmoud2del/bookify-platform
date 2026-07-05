const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const requireJsonMiddleware = (req, res, next) => {

  if (!req.is("application/json")) {
    return next(createError("Content-Type must be application/json", 415));
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return next(createError("Request body is required", 400));
  }

  next();
};

export default requireJsonMiddleware;
