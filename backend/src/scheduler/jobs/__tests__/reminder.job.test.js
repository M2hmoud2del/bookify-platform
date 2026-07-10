import assert from "node:assert/strict";
import test from "node:test";

import { runReminderJob } from "../reminder.job.js";
import { startScheduler } from "../../scheduler.bootstrap.js";

const now = new Date("2099-07-10T09:00:00.000Z");

test("reminder job selects confirmed appointments in reminder window", async () => {
  const marked = [];
  const sent = [];

  const result = await runReminderJob({
    now,
    reminderHours: 24,
    repository: {
      findCandidates: async () => [
        {
          _id: "appointment-1",
          status: "confirmed",
          localDate: "2099-07-11",
          startTime: "08:00",
          timezone: "UTC"
        }
      ],
      markReminderSent: async (id) => marked.push(id)
    },
    notificationService: {
      sendAppointmentReminder: async (id) => sent.push(id)
    }
  });

  assert.equal(result.processed, 1);
  assert.deepEqual(sent, ["appointment-1"]);
  assert.deepEqual(marked, ["appointment-1"]);
});

test("reminder job ignores cancelled rejected and pending_payment appointments", async () => {
  const result = await runReminderJob({
    now,
    reminderHours: 24,
    repository: {
      findCandidates: async () => [
        { _id: "a1", status: "cancelled", localDate: "2099-07-11", startTime: "08:00", timezone: "UTC" },
        { _id: "a2", status: "rejected", localDate: "2099-07-11", startTime: "08:00", timezone: "UTC" },
        { _id: "a3", status: "pending_payment", localDate: "2099-07-11", startTime: "08:00", timezone: "UTC" }
      ],
      markReminderSent: async () => {
        throw new Error("should not mark");
      }
    },
    notificationService: {
      sendAppointmentReminder: async () => {
        throw new Error("should not send");
      }
    }
  });

  assert.equal(result.processed, 0);
});

test("scheduler does not start during test environment", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "test";

  const tasks = startScheduler();

  process.env.NODE_ENV = previousNodeEnv;
  assert.deepEqual(tasks, []);
});
