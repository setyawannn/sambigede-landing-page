import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getBerandaConfig = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('beranda_config').first()
  },
})

export const updateBerandaConfig = mutation({
  args: {
    heroBadge: v.string(),
    heroTitle: v.string(),
    heroSubtitle: v.string(),
    heroImageUrl: v.string(),
    heroImageKey: v.optional(v.string()),
    kadesPeriode: v.string(),
    kadesSambutan: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('beranda_config').first()
    if (existing) {
      return await ctx.db.patch(existing._id, args)
    } else {
      return await ctx.db.insert('beranda_config', args)
    }
  },
})
