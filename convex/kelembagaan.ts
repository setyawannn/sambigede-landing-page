import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// Kelembagaan
export const getKelembagaanList = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('kelembagaan').withIndex('by_urutan').collect()
  },
})

export const getKelembagaanById = query({
  args: { id: v.id('kelembagaan') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getKelembagaanWithAnggota = query({
  args: {},
  handler: async (ctx) => {
    const lembagaList = await ctx.db
      .query('kelembagaan')
      .withIndex('by_urutan')
      .collect()

    // Fetch pengurus for each lembaga
    const result = await Promise.all(
      lembagaList.map(async (lembaga) => {
        const pengurus = await ctx.db
          .query('pengurus_kelembagaan')
          .withIndex('by_kelembagaan', (q) =>
            q.eq('kelembagaanId', lembaga._id),
          )
          .collect()

        // Sort pengurus by urutan
        pengurus.sort((a, b) => a.urutan - b.urutan)

        return {
          ...lembaga,
          pengurus,
        }
      }),
    )

    return result
  },
})

export const createKelembagaan = mutation({
  args: {
    nama: v.string(),
    singkatan: v.string(),
    logoUrl: v.string(),
    logoKey: v.optional(v.string()),
    deskripsi: v.optional(v.string()),
    urutan: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('kelembagaan', args)
  },
})

export const updateKelembagaan = mutation({
  args: {
    id: v.id('kelembagaan'),
    nama: v.optional(v.string()),
    singkatan: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    logoKey: v.optional(v.string()),
    deskripsi: v.optional(v.string()),
    urutan: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteKelembagaan = mutation({
  args: { id: v.id('kelembagaan') },
  handler: async (ctx, args) => {
    // Also delete all pengurus
    const pengurus = await ctx.db
      .query('pengurus_kelembagaan')
      .withIndex('by_kelembagaan', (q) => q.eq('kelembagaanId', args.id))
      .collect()

    for (const p of pengurus) {
      await ctx.db.delete(p._id)
    }

    await ctx.db.delete(args.id)
  },
})

// Pengurus Kelembagaan
export const getPengurusByKelembagaan = query({
  args: { kelembagaanId: v.id('kelembagaan') },
  handler: async (ctx, args) => {
    const pengurus = await ctx.db
      .query('pengurus_kelembagaan')
      .withIndex('by_kelembagaan', (q) =>
        q.eq('kelembagaanId', args.kelembagaanId),
      )
      .collect()

    return pengurus.sort((a, b) => a.urutan - b.urutan)
  },
})

export const createPengurus = mutation({
  args: {
    kelembagaanId: v.id('kelembagaan'),
    nama: v.string(),
    jabatan: v.string(),
    urutan: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('pengurus_kelembagaan', args)
  },
})

export const updatePengurus = mutation({
  args: {
    id: v.id('pengurus_kelembagaan'),
    nama: v.optional(v.string()),
    jabatan: v.optional(v.string()),
    urutan: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deletePengurus = mutation({
  args: { id: v.id('pengurus_kelembagaan') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
