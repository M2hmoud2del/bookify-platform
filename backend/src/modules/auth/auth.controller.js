import {
  buildAuthResponse,
  login as loginService,
  register as registerService,
  updateProfile as updateProfileService
} from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user || null
    });
  } catch (err) {
    next(err);
  }
};

export const googleCallback = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Google login successful",
      ...buildAuthResponse(req.user)
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const result = await updateProfileService(req.user._id, req.body);
    res.status(200).json({
      success: true,
      user: result
    });
  } catch (err) {
    next(err);
  }
};
