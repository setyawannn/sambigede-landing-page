import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getRtRwList = query({
  args: {
    status: v.optional(v.union(v.literal('Aktif'), v.literal('Nonaktif'))),
  },
  handler: async (ctx, args) => {
    const q = ctx.db.query('rt_rw').withIndex('by_urutan')

    // Fallback filter if status is provided, since we can't easily chain indexes
    const data = await q.collect()
    if (args.status) {
      return data.filter((p) => p.status === args.status)
    }
    return data
  },
})

export const createRtRw = mutation({
  args: {
    nama: v.string(),
    dusun: v.string(),
    jabatan: v.union(v.literal('Ketua RT'), v.literal('Ketua RW')),
    rtRw: v.string(),
    urutan: v.number(),
    status: v.union(v.literal('Aktif'), v.literal('Nonaktif')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('rt_rw', args)
  },
})

export const updateRtRw = mutation({
  args: {
    id: v.id('rt_rw'),
    nama: v.optional(v.string()),
    dusun: v.optional(v.string()),
    jabatan: v.optional(v.union(v.literal('Ketua RT'), v.literal('Ketua RW'))),
    rtRw: v.optional(v.string()),
    urutan: v.optional(v.number()),
    status: v.optional(v.union(v.literal('Aktif'), v.literal('Nonaktif'))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteRtRw = mutation({
  args: { id: v.id('rt_rw') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
