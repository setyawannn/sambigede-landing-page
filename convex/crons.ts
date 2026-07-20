import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

// Run every hour to clear old logs
crons.hourly(
  'Cleanup Old Turnstile Logs',
  { minuteUTC: 0 },
  internal.analytics.cleanupOldLogs,
)

// Run daily at midnight to clear old R2 logs
crons.daily(
  'Cleanup Old R2 Logs',
  { hourUTC: 0, minuteUTC: 0 },
  internal.r2_analytics.cleanupOldR2Logs,
)

export default crons
