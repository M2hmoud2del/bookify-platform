import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1
    },
    images: [
      {
        url: {
          type: String,
          trim: true,
          required: true
        },
        publicId: {
          type: String,
          trim: true,
          required: true
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
      }
    ],
    isActive: {
      type: Boolean,
      default: true
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

serviceSchema.index({ provider: 1, isActive: 1 });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
