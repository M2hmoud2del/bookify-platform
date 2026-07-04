const requireJsonMiddleware = (req, res, next) => {

  if (!req.is("application/json")) {
    return next(new Error("Content-Type must be application/json"));
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new Error("Request body is required"));
  }

  next();
};

export default requireJsonMiddleware;