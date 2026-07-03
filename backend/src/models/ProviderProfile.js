import mongoose from "mongoose";

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      trim: true
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    strict: true
  }
);

providerProfileSchema.index({ city: 1, category: 1 });

const ProviderProfile = mongoose.model("ProviderProfile", providerProfileSchema);

export default ProviderProfile;
