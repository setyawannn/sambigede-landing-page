import { v } from 'convex/values'
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server'
import { paginationOptsValidator } from 'convex/server'

// Helper to get current YYYY-MM
const getCurrentMonthKey = () => {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

export const getR2Settings = query({
  handler: async (ctx) => {
    let settings = await ctx.db.query('r2_settings').first()
    if (!settings) {
      settings = {
        _id: '' as any,
        _creationTime: 0,
        preventiveEnabled: false,
        dailyUploadLimit: 50,
        dailyBandwidthLimit: 104857600, // 100 MB default
        totalStorageBytes: 0,
      }
    }
    return settings
  },
})

export const saveR2Settings = mutation({
  args: {
    preventiveEnabled: v.boolean(),
    dailyUploadLimit: v.number(),
    dailyBandwidthLimit: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('r2_settings').first()
    if (existing) {
      await ctx.db.patch(existing._id, {
        preventiveEnabled: args.preventiveEnabled,
        dailyUploadLimit: args.dailyUploadLimit,
        dailyBandwidthLimit: args.dailyBandwidthLimit,
      })
    } else {
      await ctx.db.insert('r2_settings', {
        preventiveEnabled: args.preventiveEnabled,
        dailyUploadLimit: args.dailyUploadLimit,
        dailyBandwidthLimit: args.dailyBandwidthLimit,
        totalStorageBytes: 0,
      })
    }
  },
})

export const logR2Upload = mutation({
  args: {
    fileKey: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    // Insert into history log
    await ctx.db.insert('r2_uploads_log', {
      fileKey: args.fileKey,
      fileSize: args.fileSize,
      timestamp: Date.now(),
    })

    // Update cumulative total storage
    const existingSettings = await ctx.db.query('r2_settings').first()
    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        totalStorageBytes:
          (existingSettings.totalStorageBytes || 0) + args.fileSize,
      })
    }
  },
})

export const deleteR2Log = mutation({
  args: {
    fileKey: v.string(),
  },
  handler: async (ctx, args) => {
    // Find log by file key
    const log = await ctx.db
      .query('r2_uploads_log')
      .withIndex('by_fileKey', (q) => q.eq('fileKey', args.fileKey))
      .first()

    if (log) {
      // Deduct cumulative storage
      const existingSettings = await ctx.db.query('r2_settings').first()
      if (existingSettings) {
        const newTotal = Math.max(
          0,
          (existingSettings.totalStorageBytes || 0) - log.fileSize,
        )
        await ctx.db.patch(existingSettings._id, {
          totalStorageBytes: newTotal,
        })
      }
      // Delete the log entry
      await ctx.db.delete(log._id)
    }
  },
})

export const incrementClassA = mutation({
  args: {},
  handler: async (ctx) => {
    const monthKey = getCurrentMonthKey()
    const existing = await ctx.db
      .query('r2_monthly_usage')
      .withIndex('by_month', (q) => q.eq('month', monthKey))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        classACount: existing.classACount + 1,
      })
    } else {
      await ctx.db.insert('r2_monthly_usage', {
        month: monthKey,
        classACount: 1,
        classBCount: 0,
      })
    }
  },
})

export const incrementClassB = mutation({
  args: { count: v.number() },
  handler: async (ctx, args) => {
    const monthKey = getCurrentMonthKey()
    const existing = await ctx.db
      .query('r2_monthly_usage')
      .withIndex('by_month', (q) => q.eq('month', monthKey))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        classBCount: existing.classBCount + args.count,
      })
    } else {
      await ctx.db.insert('r2_monthly_usage', {
        month: monthKey,
        classACount: 0,
        classBCount: args.count,
      })
    }
  },
})

export const checkUploadQuota = query({
  args: {
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query('r2_settings').first()

    // Limits
    const MAX_STORAGE = 10 * 1024 * 1024 * 1024 // 10 GB
    const MAX_CLASS_A = 1000000

    // Check if we hit global Free Tier R2 limits
    const monthKey = getCurrentMonthKey()
    const currentUsage = await ctx.db
      .query('r2_monthly_usage')
      .withIndex('by_month', (q) => q.eq('month', monthKey))
      .first()

    if (
      settings &&
      (settings.totalStorageBytes || 0) + args.fileSize >= MAX_STORAGE
    ) {
      return {
        allowed: false,
        reason:
          'Batas 10GB R2 Storage sudah hampir penuh. Upload ditangguhkan.',
      }
    }

    if (currentUsage && currentUsage.classACount >= MAX_CLASS_A) {
      return {
        allowed: false,
        reason:
          'Batas 1 Juta Class A Operations R2 bulan ini tercapai. Upload ditangguhkan.',
      }
    }

    // Check daily quotas (preventive user-defined settings)
    if (!settings || !settings.preventiveEnabled) {
      return { allowed: true }
    }

    const now = new Date()
    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    ).getTime()

    const todaysLogs = await ctx.db
      .query('r2_uploads_log')
      .withIndex('by_timestamp', (q) => q.gte('timestamp', startOfDay))
      .collect()

    const totalUploadsToday = todaysLogs.length
    const totalBandwidthToday = todaysLogs.reduce(
      (acc, log) => acc + log.fileSize,
      0,
    )

    if (totalUploadsToday >= settings.dailyUploadLimit) {
      return {
        allowed: false,
        reason: `Batas unggahan harian (${settings.dailyUploadLimit} file) tercapai.`,
      }
    }
    if (totalBandwidthToday + args.fileSize > settings.dailyBandwidthLimit) {
      return {
        allowed: false,
        reason: `Batas bandwidth unggahan harian (${Math.round(settings.dailyBandwidthLimit / 1024 / 1024)} MB) tercapai.`,
      }
    }

    return { allowed: true }
  },
})

export const getR2Stats = query({
  handler: async (ctx) => {
    const now = new Date()
    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    ).getTime()
    const startOfWeek = startOfDay - 7 * 24 * 60 * 60 * 1000
    const startOfMonth = startOfDay - 30 * 24 * 60 * 60 * 1000

    const monthKey = getCurrentMonthKey()

    // Usage tracking
    const settings = await ctx.db.query('r2_settings').first()
    const currentMonthUsage = await ctx.db
      .query('r2_monthly_usage')
      .withIndex('by_month', (q) => q.eq('month', monthKey))
      .first()

    const logsThisMonth = await ctx.db
      .query('r2_uploads_log')
      .withIndex('by_timestamp', (q) => q.gte('timestamp', startOfMonth))
      .collect()

    let uploadsToday = 0
    let bandwidthToday = 0
    let bandwidthThisWeek = 0
    let bandwidthThisMonth = 0

    for (const log of logsThisMonth) {
      bandwidthThisMonth += log.fileSize

      if (log.timestamp >= startOfWeek) {
        bandwidthThisWeek += log.fileSize
      }

      if (log.timestamp >= startOfDay) {
        uploadsToday++
        bandwidthToday += log.fileSize
      }
    }

    // Check circuit breaker status
    const MAX_STORAGE = 10 * 1024 * 1024 * 1024 // 10 GB
    const MAX_CLASS_B = 10000000

    const classACount = currentMonthUsage?.classACount || 0
    const classBCount = currentMonthUsage?.classBCount || 0
    const totalStorageBytes = settings?.totalStorageBytes || 0

    // Trigger circuit breaker if we reach 99% of class B limit, or 99% of storage
    const circuitBreakerActive =
      classBCount >= MAX_CLASS_B * 0.99 ||
      totalStorageBytes >= MAX_STORAGE * 0.99

    return {
      uploadsToday,
      bandwidthToday,
      bandwidthThisWeek,
      bandwidthThisMonth,

      totalStorageBytes,
      classACount,
      classBCount,

      circuitBreakerActive,
    }
  },
})

export const getR2Logs = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('r2_uploads_log')
      .withIndex('by_timestamp')
      .order('desc')
      .paginate(args.paginationOpts)
  },
})

export const cleanupOldR2Logs = internalMutation({
  handler: async (ctx) => {
    // Note: We don't delete r2_uploads_log items unless the file is physically deleted
    // from R2 because totalStorageBytes calculation depends on tracking them.
    // If we clear them, we lose the exact representation of active files!
    // But since totalStorageBytes is an absolute counter now, we CAN delete old logs safely!
    // The previous implementation was keeping logs indefinitely. Let's clean logs older than 90 days.
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000

    const oldLogs = await ctx.db
      .query('r2_uploads_log')
      .withIndex('by_timestamp', (q) => q.lt('timestamp', ninetyDaysAgo))
      .take(100)

    for (const log of oldLogs) {
      await ctx.db.delete(log._id)
    }

    return oldLogs.length
  },
})

export const getCircuitBreakerStatus = query({
  handler: async (ctx) => {
    const monthKey = getCurrentMonthKey()
    const currentMonthUsage = await ctx.db
      .query('r2_monthly_usage')
      .withIndex('by_month', (q) => q.eq('month', monthKey))
      .first()
    const settings = await ctx.db.query('r2_settings').first()

    const MAX_STORAGE = 10 * 1024 * 1024 * 1024 // 10 GB
    const MAX_CLASS_B = 10000000

    const classBCount = currentMonthUsage?.classBCount || 0
    const totalStorageBytes = settings?.totalStorageBytes || 0

    return (
      classBCount >= MAX_CLASS_B * 0.99 ||
      totalStorageBytes >= MAX_STORAGE * 0.99
    )
  },
})

function extractKeyFromUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed || trimmed.startsWith('data:')) return trimmed

  const isR2Url =
    /r2\.dev/i.test(trimmed) ||
    /r2\.cloudflarestorage\.com/i.test(trimmed)

  if (isR2Url) {
    let fullUrl = trimmed
    if (!/^https?:\/\//i.test(fullUrl)) {
      fullUrl = `https://${fullUrl}`
    }
    try {
      const parsed = new URL(fullUrl)
      const key = parsed.pathname.replace(/^\//, '')
      return key || trimmed
    } catch {
      const match = trimmed.match(/(?:r2\.dev|r2\.cloudflarestorage\.com)\/(.+)$/i)
      if (match && match[1]) {
        return match[1]
      }
      return trimmed
    }
  }

  // Jika berupa URL http/https eksternal non-R2 yang punya path
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      const key = parsed.pathname.replace(/^\//, '')
      return key || trimmed
    } catch {
      return trimmed
    }
  }

  return trimmed
}

export const normalizeDatabaseImageKeys = mutation({
  args: {},
  handler: async (ctx) => {
    let updatedCount = 0

    // 1. Berita (imageUrl & imageKey)
    const beritas = await ctx.db.query('berita').collect()
    for (const b of beritas) {
      const needFix =
        b.imageUrl &&
        (/r2\.dev/i.test(b.imageUrl) ||
          /r2\.cloudflarestorage\.com/i.test(b.imageUrl) ||
          /^https?:\/\//i.test(b.imageUrl))
      if (needFix) {
        const key = extractKeyFromUrl(b.imageUrl)
        if (key && key !== b.imageUrl) {
          await ctx.db.patch(b._id, { imageUrl: key, imageKey: key })
          updatedCount++
        }
      }
    }

    // 2. Kelembagaan (logoUrl & logoKey)
    const kelembagaans = await ctx.db.query('kelembagaan').collect()
    for (const k of kelembagaans) {
      const needFix =
        k.logoUrl &&
        (/r2\.dev/i.test(k.logoUrl) ||
          /r2\.cloudflarestorage\.com/i.test(k.logoUrl) ||
          /^https?:\/\//i.test(k.logoUrl))
      if (needFix) {
        const key = extractKeyFromUrl(k.logoUrl)
        if (key && key !== k.logoUrl) {
          await ctx.db.patch(k._id, { logoUrl: key, logoKey: key })
          updatedCount++
        }
      }
    }

    // 3. Perangkat Desa (imageUrl & imageKey)
    const perangkat = await ctx.db.query('perangkat_desa').collect()
    for (const p of perangkat) {
      const needFix =
        p.imageUrl &&
        (/r2\.dev/i.test(p.imageUrl) ||
          /r2\.cloudflarestorage\.com/i.test(p.imageUrl) ||
          /^https?:\/\//i.test(p.imageUrl))
      if (needFix) {
        const key = extractKeyFromUrl(p.imageUrl)
        if (key && key !== p.imageUrl) {
          await ctx.db.patch(p._id, { imageUrl: key, imageKey: key })
          updatedCount++
        }
      }
    }

    // 4. Profil Desa (baganStrukturUrl & baganStrukturKey)
    const profil = await ctx.db.query('profil_desa').first()
    if (profil && profil.baganStrukturUrl) {
      const needFix =
        /r2\.dev/i.test(profil.baganStrukturUrl) ||
        /r2\.cloudflarestorage\.com/i.test(profil.baganStrukturUrl) ||
        /^https?:\/\//i.test(profil.baganStrukturUrl)
      if (needFix) {
        const key = extractKeyFromUrl(profil.baganStrukturUrl)
        if (key && key !== profil.baganStrukturUrl) {
          await ctx.db.patch(profil._id, {
            baganStrukturUrl: key,
            baganStrukturKey: key,
          })
          updatedCount++
        }
      }
    }

    // 5. Beranda Config (heroImageUrl & heroImageKey)
    const beranda = await ctx.db.query('beranda_config').first()
    if (beranda && beranda.heroImageUrl) {
      const needFix =
        /r2\.dev/i.test(beranda.heroImageUrl) ||
        /r2\.cloudflarestorage\.com/i.test(beranda.heroImageUrl) ||
        (/^https?:\/\//i.test(beranda.heroImageUrl) &&
          !beranda.heroImageUrl.includes('images.unsplash.com'))
      if (needFix) {
        const key = extractKeyFromUrl(beranda.heroImageUrl)
        if (key && key !== beranda.heroImageUrl) {
          await ctx.db.patch(beranda._id, {
            heroImageUrl: key,
            heroImageKey: key,
          })
          updatedCount++
        }
      }
    }

    return { success: true, updatedRecords: updatedCount }
  },
})
