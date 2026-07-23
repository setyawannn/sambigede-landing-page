import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// --- Mitra Desa ---

export const getMitraList = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('mitra_desa').withIndex('by_urutan').collect()
  },
})

export const getMitraById = query({
  args: { id: v.id('mitra_desa') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createMitra = mutation({
  args: {
    nama: v.string(),
    singkatan: v.string(),
    penanggungJawab: v.array(v.string()),
    logoUrl: v.string(),
    logoKey: v.optional(v.string()),
    urutan: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('mitra_desa', args)
  },
})

export const updateMitra = mutation({
  args: {
    id: v.id('mitra_desa'),
    nama: v.optional(v.string()),
    singkatan: v.optional(v.string()),
    penanggungJawab: v.optional(v.array(v.string())),
    logoUrl: v.optional(v.string()),
    logoKey: v.optional(v.string()),
    urutan: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteMitra = mutation({
  args: { id: v.id('mitra_desa') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
