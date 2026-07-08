import {
  createCheckoutSession as createCheckoutSessionService,
  getMyPayments as getMyPaymentsService,
  handleStripeWebhook as handleStripeWebhookService
} from "./payment.service.js";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const result = await createCheckoutSessionService(req.user._id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getMyPayments = async (req, res, next) => {
  try {
    const result = await getMyPaymentsService(req.user);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleStripeWebhook = async (req, res, next) => {
  try {
    const result = await handleStripeWebhookService({
      body: req.body,
      signature: req.headers["stripe-signature"]
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
