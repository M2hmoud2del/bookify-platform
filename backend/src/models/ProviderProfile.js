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
      url: {
        type: String,
        trim: true,
        default: ""
      },
      publicId: {
        type: String,
        trim: true,
        default: ""
      },
      width: {
        type: Number,
        min: 0,
        default: 0
      },
      height: {
        type: Number,
        min: 0,
        default: 0
      },
      format: {
        type: String,
        trim: true,
        default: ""
      },
      bytes: {
        type: Number,
        min: 0,
        default: 0
      },
      moderationStatus: {
        type: String,
        enum: ["pending_review", "approved", "rejected"],
        default: "pending_review"
      }
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
    isActive: {
      type: Boolean,
      default: true,
      index: true
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
