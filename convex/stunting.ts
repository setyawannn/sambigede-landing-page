import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getStunting = query({
  args: {
    bulan: v.optional(v.number()),
    tahun: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.bulan !== undefined && args.tahun !== undefined) {
      return await ctx.db
        .query('stunting')
        .withIndex('by_periode', (q) =>
          q.eq('bulan', args.bulan!).eq('tahun', args.tahun!),
        )
        .collect()
    }
    return await ctx.db.query('stunting').collect()
  },
})

export const getDistinctPeriode = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('stunting').collect()
    const uniq = new Map<string, { bulan: number; tahun: number }>()
    for (const item of all) {
      const key = `${item.bulan}-${item.tahun}`
      if (!uniq.has(key)) {
        uniq.set(key, { bulan: item.bulan, tahun: item.tahun })
      }
    }
    return [...uniq.values()].sort(
      (a, b) => b.tahun - a.tahun || b.bulan - a.bulan,
    )
  },
})

export const batchInsertStunting = mutation({
  args: {
    data: v.array(
      v.object({
        nama: v.string(),
        nik: v.optional(v.string()),
        tanggalLahir: v.number(),
        jk: v.union(v.literal('L'), v.literal('P')),
        namaOrtu: v.string(),
        alamat: v.string(),
        pos: v.string(),
      }),
    ),
    bulan: v.number(),
    tahun: v.number(),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.insert('stunting', {
        ...item,
        bulan: args.bulan,
        tahun: args.tahun,
      })
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
    nik: v.optional(v.string()),
    tanggalLahir: v.number(),
    jk: v.union(v.literal('L'), v.literal('P')),
    namaOrtu: v.string(),
    alamat: v.string(),
    pos: v.string(),
    bulan: v.number(),
    tahun: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('stunting', args)
  },
})

export const updateStunting = mutation({
  args: {
    id: v.id('stunting'),
    nama: v.optional(v.string()),
    nik: v.optional(v.string()),
    tanggalLahir: v.optional(v.number()),
    jk: v.optional(v.union(v.literal('L'), v.literal('P'))),
    namaOrtu: v.optional(v.string()),
    alamat: v.optional(v.string()),
    pos: v.optional(v.string()),
    bulan: v.optional(v.number()),
    tahun: v.optional(v.number()),
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
