import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "usd",
      lowercase: true,
      trim: true,
      match: [/^[a-z]{3}$/, "Currency must be a 3-letter ISO code"]
    },
    stripeSessionId: {
      type: String,
      trim: true
    },
    stripePaymentIntentId: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    }
  },
  {
    timestamps: true,
    strict: true
  }
);

paymentSchema.index({ appointment: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ provider: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
