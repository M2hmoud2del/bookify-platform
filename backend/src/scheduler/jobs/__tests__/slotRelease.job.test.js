import assert from "node:assert/strict";
import test from "node:test";

import { runSlotReleaseJob } from "../slotRelease.job.js";

const now = new Date("2099-07-10T10:00:00.000Z");

test("slot release job cancels expired pending_payment appointments", async () => {
  const cancelled = [];

  const result = await runSlotReleaseJob({
    now,
    expiryMinutes: 15,
    repository: {
      findExpiredPendingAppointments: async () => [
        {
          _id: "appointment-1",
          status: "pending_payment",
          paymentStatus: "unpaid"
        }
      ],
      cancelExpired: async (id) => cancelled.push(id)
    }
  });

  assert.equal(result.processed, 1);
  assert.deepEqual(cancelled, ["appointment-1"]);
});

test("slot release job ignores paid and confirmed appointments", async () => {
  const result = await runSlotReleaseJob({
    now,
    repository: {
      findExpiredPendingAppointments: async () => [
        { _id: "a1", status: "pending_payment", paymentStatus: "paid" },
        { _id: "a2", status: "confirmed", paymentStatus: "paid" }
      ],
      cancelExpired: async () => {
        throw new Error("should not cancel");
      }
    }
  });

  assert.equal(result.processed, 0);
});
