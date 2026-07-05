const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const authorizeMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!req.user) {
      return next(createError("Unauthorized", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        createError("Forbidden: You do not have permission", 403)
      );
    }

    next();
  };
};

export default authorizeMiddleware;
