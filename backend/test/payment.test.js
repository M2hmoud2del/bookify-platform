import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import { handleStripeWebhook } from "../src/modules/payment/payment.service.js";

const originalWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const appointmentId = "appointment-1";
const paymentId = "payment-1";

const createStripe = (event) => ({
  webhooks: {
    constructEvent: () => event
  }
});

const createRepository = ({ payment = {}, appointment = {} } = {}) => {
  const updates = [];
  const basePayment = {
    _id: paymentId,
    appointment: appointmentId,
    stripePaymentIntentId: "pi_1",
    status: "pending",
    ...payment
  };

  return {
    updates,
    findPaymentByStripeSessionId: async () => basePayment,
    findPaymentByStripePaymentIntentId: async () => basePayment,
    updatePayment: async (id, updateData) => {
      updates.push({ id, updateData });
      return { ...basePayment, ...updateData, _id: id };
    },
    confirmAppointmentPayment: async (id) => ({
      _id: id,
      status: "confirmed",
      paymentStatus: "paid",
      ...appointment
    }),
    markAppointmentPaymentRefunded: async (id) => ({
      _id: id,
      paymentStatus: "refunded",
      ...appointment
    })
  };
};

const createNotifications = (calls, overrides = {}) => ({
  sendPaymentSuccessNotification: async (id) => calls.push(["payment_success", id]),
  sendBookingConfirmation: async (id) => calls.push(["booking_confirmation", id]),
  sendNewBookingAlert: async (id) => calls.push(["new_booking_alert", id]),
  sendPaymentFailedNotification: async (id) => calls.push(["payment_failed", id]),
  sendRefundIssuedNotification: async (id) => calls.push(["refund_issued", id]),
  ...overrides
});

beforeEach(() => {
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
});

afterEach(() => {
  if (originalWebhookSecret === undefined) {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  } else {
    process.env.STRIPE_WEBHOOK_SECRET = originalWebhookSecret;
  }
});

test("successful payment webhook triggers payment success, booking confirmation, and provider alert", async () => {
  const calls = [];
  const repository = createRepository();
  const event = {
    type: "checkout.session.completed",
    data: { object: { id: "cs_1", payment_intent: "pi_1" } }
  };

  const result = await handleStripeWebhook(
    { body: Buffer.from("{}"), signature: "sig" },
    {
      stripe: createStripe(event),
      repository,
      notifications: createNotifications(calls),
      logger: { warn: () => {} }
    }
  );

  assert.equal(result.success, true);
  assert.equal(result.data.payment.status, "paid");
  assert.equal(result.data.appointment.status, "confirmed");
  assert.deepEqual(calls, [
    ["payment_success", appointmentId],
    ["booking_confirmation", appointmentId],
    ["new_booking_alert", appointmentId]
  ]);
});

test("failed notification sending does not fail payment webhook", async () => {
  const calls = [];
  const warnings = [];
  const event = {
    type: "checkout.session.completed",
    data: { object: { id: "cs_1", payment_intent: "pi_1" } }
  };

  const result = await handleStripeWebhook(
    { body: Buffer.from("{}"), signature: "sig" },
    {
      stripe: createStripe(event),
      repository: createRepository(),
      notifications: createNotifications(calls, {
        sendPaymentSuccessNotification: async () => {
          throw new Error("smtp down");
        }
      }),
      logger: { warn: (message, metadata) => warnings.push({ message, metadata }) }
    }
  );

  assert.equal(result.success, true);
  assert.equal(result.received, true);
  assert.equal(warnings.length, 1);
  assert.equal(warnings[0].metadata.flow, "payment_success");
  assert.deepEqual(calls, [
    ["booking_confirmation", appointmentId],
    ["new_booking_alert", appointmentId]
  ]);
});

test("payment failed webhook triggers payment failed notification", async () => {
  const calls = [];
  const event = {
    type: "payment_intent.payment_failed",
    data: { object: { id: "pi_1" } }
  };

  const result = await handleStripeWebhook(
    { body: Buffer.from("{}"), signature: "sig" },
    {
      stripe: createStripe(event),
      repository: createRepository(),
      notifications: createNotifications(calls),
      logger: { warn: () => {} }
    }
  );

  assert.equal(result.data.payment.status, "failed");
  assert.deepEqual(calls, [["payment_failed", appointmentId]]);
});

test("refund webhook triggers refund issued notification when refund flow exists", async () => {
  const calls = [];
  const event = {
    type: "charge.refunded",
    data: { object: { payment_intent: "pi_1" } }
  };

  const result = await handleStripeWebhook(
    { body: Buffer.from("{}"), signature: "sig" },
    {
      stripe: createStripe(event),
      repository: createRepository(),
      notifications: createNotifications(calls),
      logger: { warn: () => {} }
    }
  );

  assert.equal(result.data.payment.status, "refunded");
  assert.equal(result.data.appointment.paymentStatus, "refunded");
  assert.deepEqual(calls, [["refund_issued", paymentId]]);
});

test("refund notification is skipped when refund event has no payment intent", async () => {
  const calls = [];
  const event = {
    type: "charge.refunded",
    data: { object: {} }
  };

  const result = await handleStripeWebhook(
    { body: Buffer.from("{}"), signature: "sig" },
    {
      stripe: createStripe(event),
      repository: createRepository(),
      notifications: createNotifications(calls),
      logger: { warn: () => {} }
    }
  );

  assert.equal(result.data, null);
  assert.deepEqual(calls, []);
});
