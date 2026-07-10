import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { sendMail } from "../mail.adapter.js";
import transporter from "../mail.client.js";
import { MailDeliveryError } from "../mail.errors.js";

const originalSendMail = transporter.sendMail;

afterEach(() => {
  transporter.sendMail = originalSendMail;
});

test("mail adapter sends email with correct payload", async () => {
  let payload;
  transporter.sendMail = async (message) => {
    payload = message;
    return { messageId: "message-1" };
  };

  const result = await sendMail({
    to: "customer@example.com",
    subject: "Hello",
    html: "<p>Hello</p>",
    text: "Hello"
  });

  assert.equal(payload.to, "customer@example.com");
  assert.equal(payload.subject, "Hello");
  assert.equal(result.messageId, "message-1");
});

test("mail adapter wraps transporter errors", async () => {
  transporter.sendMail = async () => {
    throw new Error("smtp failed");
  };

  await assert.rejects(
    () =>
      sendMail({
        to: "customer@example.com",
        subject: "Hello",
        html: "<p>Hello</p>"
      }),
    MailDeliveryError
  );
});
