import assert from "node:assert/strict";
import test from "node:test";

import { runReviewRequestJob } from "../reviewRequest.job.js";

const now = new Date("2099-07-10T10:00:00.000Z");

test("review request job sends only for completed appointments without review", async () => {
  const sent = [];
  const marked = [];

  const result = await runReviewRequestJob({
    now,
    delayHours: 2,
    repository: {
      findCandidates: async () => [
        { _id: "appointment-1", status: "completed", completedAt: new Date("2099-07-10T07:00:00.000Z") }
      ],
      findReviewByAppointment: async () => null,
      markReviewRequestSent: async (id) => marked.push(id)
    },
    notificationService: {
      sendReviewRequest: async (id) => sent.push(id)
    }
  });

  assert.equal(result.processed, 1);
  assert.deepEqual(sent, ["appointment-1"]);
  assert.deepEqual(marked, ["appointment-1"]);
});

test("review request job skips completed appointments that already have review", async () => {
  const result = await runReviewRequestJob({
    now,
    repository: {
      findCandidates: async () => [
        { _id: "appointment-1", status: "completed", completedAt: new Date("2099-07-10T07:00:00.000Z") }
      ],
      findReviewByAppointment: async () => ({ _id: "review-1" }),
      markReviewRequestSent: async () => {
        throw new Error("should not mark");
      }
    },
    notificationService: {
      sendReviewRequest: async () => {
        throw new Error("should not send");
      }
    }
  });

  assert.equal(result.processed, 0);
});
