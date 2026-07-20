import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getApbdes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('apbdes').collect()
  },
})

export const batchInsertApbdes = mutation({
  args: {
    data: v.array(
      v.object({
        nama: v.string(),
        kategori: v.union(
          v.literal('Pendapatan'),
          v.literal('Belanja'),
          v.literal('Pembiayaan'),
        ),
        nilai: v.number(),
        realisasi: v.number(),
        sumberDana: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.insert('apbdes', item)
    }
    return { success: true, count: args.data.length }
  },
})

export const clearApbdes = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('apbdes').collect()
    for (const item of all) {
      await ctx.db.delete(item._id)
    }
    return { success: true, count: all.length }
  },
})

export const createApbdes = mutation({
  args: {
    nama: v.string(),
    kategori: v.union(
      v.literal('Pendapatan'),
      v.literal('Belanja'),
      v.literal('Pembiayaan'),
    ),
    nilai: v.number(),
    realisasi: v.number(),
    sumberDana: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('apbdes', args)
  },
})

export const updateApbdes = mutation({
  args: {
    id: v.id('apbdes'),
    nama: v.optional(v.string()),
    kategori: v.optional(
      v.union(
        v.literal('Pendapatan'),
        v.literal('Belanja'),
        v.literal('Pembiayaan'),
      ),
    ),
    nilai: v.optional(v.number()),
    realisasi: v.optional(v.number()),
    sumberDana: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteApbdes = mutation({
  args: { id: v.id('apbdes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
