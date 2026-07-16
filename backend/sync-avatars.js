import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import ProviderProfile from "./src/models/ProviderProfile.js";
import User from "./src/models/User.js";

async function syncAvatars() {
  await connectDB();
  const profiles = await ProviderProfile.find();
  let count = 0;
  for (const profile of profiles) {
    if (profile.profileImage && profile.profileImage.url) {
      await User.findByIdAndUpdate(profile.user, { avatar: profile.profileImage.url });
      count++;
    }
  }
  console.log(`Synced ${count} provider avatars.`);
  process.exit(0);
}

syncAvatars().catch(console.error);
