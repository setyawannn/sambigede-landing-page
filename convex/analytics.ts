import { v } from 'convex/values'
import { internalMutation, query } from './_generated/server'
import { paginationOptsValidator } from 'convex/server'

export const logTurnstileAttempt = internalMutation({
  args: {
    action: v.union(v.literal('login'), v.literal('pengaduan')),
    success: v.boolean(),
    visitorId: v.string(),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('turnstile_logs', {
      action: args.action,
      success: args.success,
      visitorId: args.visitorId,
      errorMessage: args.errorMessage,
      timestamp: Date.now(),
    })
  },
})

export const cleanupOldLogs = internalMutation({
  handler: async (ctx) => {
    // Keep logs for the last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

    // Using pagination internally to delete in batches so we don't exceed mutation limits
    const oldLogs = await ctx.db
      .query('turnstile_logs')
      .withIndex('by_timestamp', (q) => q.lt('timestamp', thirtyDaysAgo))
      .take(100) // Process 100 at a time to avoid timeout

    for (const log of oldLogs) {
      await ctx.db.delete(log._id)
    }

    return oldLogs.length
  },
})

export const getTurnstileStats = query({
  handler: async (ctx) => {
    // We fetch recent logs (e.g., last 24 hours or just take the last 1000 logs) to compute stats
    const recentLogs = await ctx.db
      .query('turnstile_logs')
      .withIndex('by_timestamp')
      .order('desc')
      .take(1000) // 1000 logs max for fast query computation in memory

    let totalSuccess = 0
    let totalFailed = 0
    let loginCount = 0
    let pengaduanCount = 0

    const last15Mins = Date.now() - 15 * 60 * 1000
    let failuresLast15Mins = 0

    const failedVisitorIds: Record<string, number> = {}

    for (const log of recentLogs) {
      if (log.success) {
        totalSuccess++
      } else {
        totalFailed++
        if (log.timestamp > last15Mins) {
          failuresLast15Mins++
          failedVisitorIds[log.visitorId] =
            (failedVisitorIds[log.visitorId] || 0) + 1
        }
      }

      if (log.action === 'login') loginCount++
      if (log.action === 'pengaduan') pengaduanCount++
    }

    const totalLogs = recentLogs.length
    const successRate = totalLogs > 0 ? (totalSuccess / totalLogs) * 100 : 100

    let securityStatus = 'Aman'
    if (
      failuresLast15Mins > 15 ||
      (failuresLast15Mins > 5 && successRate < 50)
    ) {
      securityStatus = 'Bahaya'
    } else if (failuresLast15Mins >= 5) {
      securityStatus = 'Waspada'
    }

    // Suspicious visitors (failed > 3 times in last 15 mins)
    const suspiciousActivities = Object.entries(failedVisitorIds)
      .filter(([_, count]) => count > 3)
      .map(([visitorId, count]) => ({ visitorId, failureCount: count }))

    return {
      totalLogs,
      successRate: Math.round(successRate * 10) / 10,
      totalBlocked: totalFailed,
      securityStatus,
      loginPercentage:
        totalLogs > 0 ? Math.round((loginCount / totalLogs) * 100) : 0,
      pengaduanPercentage:
        totalLogs > 0 ? Math.round((pengaduanCount / totalLogs) * 100) : 0,
      suspiciousCount: suspiciousActivities.length,
      suspiciousActivities,
    }
  },
})

export const getTurnstileLogs = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('turnstile_logs')
      .withIndex('by_timestamp')
      .order('desc')
      .paginate(args.paginationOpts)
  },
})
