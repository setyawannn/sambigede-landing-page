import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getStunting = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('stunting').collect()
  },
})

export const batchInsertStunting = mutation({
  args: {
    data: v.array(
      v.object({
        nama: v.string(),
        dusun: v.string(),
        usia: v.string(),
        bb: v.string(),
        tb: v.string(),
        status: v.union(
          v.literal('Normal'),
          v.literal('Risiko'),
          v.literal('Stunting'),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.insert('stunting', item)
    }
    return { success: true, count: args.data.length }
  },
})

export const clearStunting = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('stunting').collect()
    for (const item of all) {
      await ctx.db.delete(item._id)
    }
    return { success: true, count: all.length }
  },
})

export const createStunting = mutation({
  args: {
    nama: v.string(),
    dusun: v.string(),
    usia: v.string(),
    bb: v.string(),
    tb: v.string(),
    status: v.union(
      v.literal('Normal'),
      v.literal('Risiko'),
      v.literal('Stunting'),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('stunting', args)
  },
})

export const updateStunting = mutation({
  args: {
    id: v.id('stunting'),
    nama: v.optional(v.string()),
    dusun: v.optional(v.string()),
    usia: v.optional(v.string()),
    bb: v.optional(v.string()),
    tb: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal('Normal'), v.literal('Risiko'), v.literal('Stunting')),
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteStunting = mutation({
  args: { id: v.id('stunting') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
