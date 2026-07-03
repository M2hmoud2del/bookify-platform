import mongoose from "mongoose";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const workingHourSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dayOfWeek: {
      type: String,
      enum: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ],
      required: true
    },
    startTime: {
      type: String,
      match: [timeRegex, "Start time must use HH:mm format"]
    },
    endTime: {
      type: String,
      match: [timeRegex, "End time must use HH:mm format"]
    },
    isClosed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    strict: true
  }
);

workingHourSchema.index({ provider: 1, dayOfWeek: 1 }, { unique: true });

const WorkingHour = mongoose.model("WorkingHour", workingHourSchema);

export default WorkingHour;
