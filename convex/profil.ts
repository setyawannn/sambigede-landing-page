import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getProfil = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('profil_desa').first()
  },
})

export const updateProfil = mutation({
  args: {
    visi: v.string(),
    misi: v.array(v.string()),
    sejarah: v.optional(v.string()),
    baganStrukturUrl: v.optional(v.string()),
    baganStrukturKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('profil_desa').first()
    if (existing) {
      return await ctx.db.patch(existing._id, args)
    } else {
      return await ctx.db.insert('profil_desa', args)
    }
  },
})
