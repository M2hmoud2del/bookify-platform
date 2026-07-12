import assert from "node:assert/strict";
import test from "node:test";

import { runStatusTransitionJob } from "../statusTransition.job.js";

const now = new Date("2099-07-10T10:00:00.000Z");

test("status transition job completes past confirmed appointments", async () => {
  const completed = [];

  const result = await runStatusTransitionJob({
    now,
    repository: {
      findCandidates: async () => [
        {
          _id: "appointment-1",
          status: "confirmed",
          localDate: "2099-07-10",
          endTime: "09:00",
          timezone: "UTC"
        }
      ],
      markCompleted: async (id) => completed.push(id)
    }
  });

  assert.equal(result.processed, 1);
  assert.deepEqual(completed, ["appointment-1"]);
});

test("status transition job does not complete pending_payment appointments", async () => {
  const result = await runStatusTransitionJob({
    now,
    repository: {
      findCandidates: async () => [
        {
          _id: "appointment-1",
          status: "pending_payment",
          localDate: "2099-07-10",
          endTime: "09:00",
          timezone: "UTC"
        }
      ],
      markCompleted: async () => {
        throw new Error("should not complete");
      }
    }
  });

  assert.equal(result.processed, 0);
});
