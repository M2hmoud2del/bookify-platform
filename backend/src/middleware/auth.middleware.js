import User from "../models/User.js";
import {verifyToken} from "../utils/jwt.util.js";

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new Error("No token provided", 401));
    }

    // 2. Extract token (Bearer token)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new Error("Invalid token format", 401));
    }

    // 3. Verify token
    const decoded = verifyToken(token);

    // 4. Find user in DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User no longer exists", 401));
    }

    // 5. Attach user to request
    req.user = user;

    // 6. Continue
    next();

  } catch (err) {
    return next(new Error("Unauthorized", 401));
  }
};

export default authMiddleware;