import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getBansos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('bansos').collect()
  },
})

export const batchInsertBansos = mutation({
  args: {
    data: v.array(
      v.object({
        nama: v.string(),
        nik: v.optional(v.string()),
        alamat: v.string(),
        jenisBansos: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.insert('bansos', item)
    }
    return { success: true, count: args.data.length }
  },
})

export const clearBansos = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('bansos').collect()
    for (const item of all) {
      await ctx.db.delete(item._id)
    }
    return { success: true, count: all.length }
  },
})

export const createBansos = mutation({
  args: {
    nama: v.string(),
    nik: v.optional(v.string()),
    alamat: v.string(),
    jenisBansos: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('bansos', args)
  },
})

export const updateBansos = mutation({
  args: {
    id: v.id('bansos'),
    nama: v.optional(v.string()),
    nik: v.optional(v.string()),
    alamat: v.optional(v.string()),
    jenisBansos: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteBansos = mutation({
  args: { id: v.id('bansos') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
