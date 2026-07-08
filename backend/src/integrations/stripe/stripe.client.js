import Stripe from "stripe";

let stripeClient;

export const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error("STRIPE_SECRET_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
};
