import "dotenv/config";
import crypto from "crypto";

import bcrypt from "bcrypt";
import passport from "passport";
import GoogleOAuth2 from "passport-google-oauth2";

import User from "../../../models/User.js";

const { Strategy: GoogleStrategy } = GoogleOAuth2;
const hasGoogleOAuthConfig =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getProfileEmail = (profile) => {
  return profile.email || profile.emails?.[0]?.value;
};

const getProfileAvatar = (profile) => {
  return profile.picture || profile.photos?.[0]?.value;
};

const getRequestedRole = (request) => {
  return request.query?.state === "provider" ? "provider" : "customer";
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error);
  }
});

if (hasGoogleOAuthConfig) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          const email = getProfileEmail(profile);

          if (!email) {
            return done(createError("Google account did not provide an email", 400));
          }

          const googleId = profile.id;
          const avatar = getProfileAvatar(profile);
          const requestedRole = getRequestedRole(request);

          let user = await User.findOne({
            $or: [{ googleId }, { email: email.toLowerCase() }],
            deletedAt: null
          });

          if (user) {
            user.googleId = user.googleId || googleId;
            user.avatar = user.avatar || avatar;
            await user.save();
            return done(null, user);
          }

          const randomPassword = crypto.randomBytes(24).toString("hex");
          const hashedPassword = await bcrypt.hash(
            randomPassword,
            Number(process.env.BCRYPT_SALT_ROUNDS) || 10
          );

          user = await User.create({
            name: profile.displayName || email.split("@")[0],
            email,
            password: hashedPassword,
            googleId,
            authProvider: "google",
            role: requestedRole,
            avatar,
            isActive: true,
            deletedAt: null
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

export default passport;
