import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every hour to clear old logs
crons.hourly(
  "Cleanup Old Turnstile Logs",
  { minuteUTC: 0 },
  internal.analytics.cleanupOldLogs
);

export default crons;
