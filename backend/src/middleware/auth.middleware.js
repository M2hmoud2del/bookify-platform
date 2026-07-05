import User from "../models/User.js";
import {verifyToken} from "../utils/jwt.util.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(createError("No token provided", 401));
    }

    // 2. Extract token (Bearer token)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(createError("Invalid token format", 401));
    }

    // 3. Verify token
    const decoded = verifyToken(token);

    // 4. Find user in DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(createError("User no longer exists", 401));
    }

    // 5. Attach user to request
    req.user = user;

    // 6. Continue
    next();

  } catch (err) {
    return next(createError("Unauthorized", 401));
  }
};

export default authMiddleware;
