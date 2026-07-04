const authorizeMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!req.user) {
      return next(new Error("Unauthorized", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new Error("Forbidden: You do not have permission", 403)
      );
    }

    next();
  };
};

export default authorizeMiddleware;