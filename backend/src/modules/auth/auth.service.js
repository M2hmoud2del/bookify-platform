import bcrypt from "bcrypt";

import User from "../../models/User.js";
import {generateToken} from "../../utils/jwt.util.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const register = async (userData) => {
  const { name, email, password, role, phone } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone
  });

  return buildAuthResponse(user);
};

export const login = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw createError("Invalid email or password", 401);
  }

  return buildAuthResponse(user);
};

export const buildAuthResponse = (user) => {
  const { password: _, ...userObject } = user.toObject();

  return {
    user: userObject,
    token: generateToken(user)
  };
};

export const updateProfile = async (userId, updateData) => {
  const { name, phone, email } = updateData;

  const updatePayload = { name, phone };
  
  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw createError("Email already exists", 409);
    }
    updatePayload.email = email;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updatePayload,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw createError("User not found", 404);
  }

  const { password: _, ...userObject } = user.toObject();
  return userObject;
};
