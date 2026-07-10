import cron from "node-cron";

import { ENABLE_SCHEDULER } from "../config/constants.js";
import { runReminderJob } from "./jobs/reminder.job.js";
import { runReviewRequestJob } from "./jobs/reviewRequest.job.js";
import { runSlotReleaseJob } from "./jobs/slotRelease.job.js";
import { runStatusTransitionJob } from "./jobs/statusTransition.job.js";

const safeRun = (jobName, runner) => async () => {
  try {
    const result = await runner();
    console.log(`${jobName} completed`, result);
  } catch (error) {
    console.error(`${jobName} failed: ${error.message}`);
  }
};

export const startScheduler = () => {
  if (!ENABLE_SCHEDULER || process.env.NODE_ENV === "test") {
    console.log("Bookify scheduler disabled");
    return [];
  }

  const tasks = [
    cron.schedule("*/15 * * * *", safeRun("reminder.job", runReminderJob)),
    cron.schedule("*/10 * * * *", safeRun("slotRelease.job", runSlotReleaseJob)),
    cron.schedule("*/30 * * * *", safeRun("statusTransition.job", runStatusTransitionJob)),
    cron.schedule("0 * * * *", safeRun("reviewRequest.job", runReviewRequestJob))
  ];

  console.log("Bookify scheduler started");
  return tasks;
};
