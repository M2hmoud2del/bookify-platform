import bcrypt from "bcrypt";

import User from "../../models/User.js";
import {generateToken} from "../../utils/jwt.util.js";

export const register = async (userData) => {
  const { name, email, password, role, phone } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
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
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
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