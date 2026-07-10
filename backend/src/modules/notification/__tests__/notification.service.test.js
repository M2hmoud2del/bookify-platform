import assert from "node:assert/strict";
import test from "node:test";

import {
  createNotification,
  retryFailedNotifications,
  sendNotification
} from "../notification.service.js";

const createFakeRepository = (initialNotification = {}) => {
  const store = new Map();
  let counter = 1;
  const repository = {
    createNotification: async (data) => {
      const notification = {
        _id: `notification-${counter++}`,
        status: "pending",
        attempts: 0,
        maxAttempts: 3,
        metadata: {},
        ...data
      };
      store.set(notification._id, notification);
      return notification;
    },
    findNotificationById: async (id) => store.get(id),
    markNotificationSent: async (id, update) => {
      const notification = store.get(id);
      const updated = {
        ...notification,
        status: "sent",
        attempts: notification.attempts + 1,
        sentAt: update.sentAt,
        metadata: update.metadata
      };
      store.set(id, updated);
      return updated;
    },
    markNotificationFailed: async (id, error, nextRetryAt) => {
      const notification = store.get(id);
      const updated = {
        ...notification,
        status: "failed",
        attempts: notification.attempts + 1,
        lastError: error,
        nextRetryAt
      };
      store.set(id, updated);
      return updated;
    },
    findRetryableFailedNotifications: async () =>
      [...store.values()].filter((notification) => notification.status === "failed")
  };

  if (initialNotification._id) {
    store.set(initialNotification._id, initialNotification);
  }

  return { repository, store };
};

test("notification service creates notification record", async () => {
  const { repository } = createFakeRepository();

  const notification = await createNotification(
    {
      recipient: "user-1",
      type: "booking_confirmation",
      toEmail: "user@example.com",
      subject: "Subject"
    },
    { repository }
  );

  assert.equal(notification.recipient, "user-1");
  assert.equal(notification.status, "pending");
});

test("notification service marks notification sent on success", async () => {
  const { repository } = createFakeRepository({
    _id: "notification-1",
    toEmail: "user@example.com",
    subject: "Subject",
    attempts: 0,
    maxAttempts: 3,
    metadata: { html: "<p>Hi</p>" }
  });

  const result = await sendNotification("notification-1", {
    repository,
    mailer: { sendMail: async () => ({ messageId: "message-1" }) }
  });

  assert.equal(result.status, "sent");
  assert.equal(result.attempts, 1);
  assert.equal(result.metadata.messageId, "message-1");
});

test("notification service marks notification failed on mail error", async () => {
  const { repository } = createFakeRepository({
    _id: "notification-1",
    toEmail: "user@example.com",
    subject: "Subject",
    attempts: 0,
    maxAttempts: 3,
    metadata: { html: "<p>Hi</p>" }
  });

  const result = await sendNotification("notification-1", {
    repository,
    mailer: {
      sendMail: async () => {
        throw new Error("smtp down");
      }
    }
  });

  assert.equal(result.status, "failed");
  assert.equal(result.lastError, "smtp down");
  assert.equal(result.attempts, 1);
});

test("retry logic does not exceed maxAttempts", async () => {
  const { repository } = createFakeRepository({
    _id: "notification-1",
    status: "failed",
    toEmail: "user@example.com",
    subject: "Subject",
    attempts: 3,
    maxAttempts: 3,
    metadata: { html: "<p>Hi</p>" }
  });

  const results = await retryFailedNotifications({
    repository,
    mailer: { sendMail: async () => ({ messageId: "message-1" }) }
  });

  assert.equal(results.length, 0);
});
