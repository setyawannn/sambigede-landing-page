import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// --- BUMDes ---

export const getBumdesList = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('bumdes').withIndex('by_urutan').collect()
  },
})

export const getBumdesById = query({
  args: { id: v.id('bumdes') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createBumdes = mutation({
  args: {
    nama: v.string(),
    kategori: v.string(),
    logoUrl: v.optional(v.string()),
    logoKey: v.optional(v.string()),
    deskripsi: v.string(),
    fotoProduk: v.optional(v.array(v.string())),
    fotoProdukKeys: v.optional(v.array(v.string())),
    statusHukum: v.string(),
    kontak: v.string(),
    lokasi: v.string(),
    mapsUrl: v.optional(v.string()),
    struktur: v.array(
      v.object({
        jabatan: v.string(),
        nama: v.string(),
      })
    ),
    jumlahTenagaKerja: v.number(),
    urutan: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('bumdes', args)
  },
})

export const updateBumdes = mutation({
  args: {
    id: v.id('bumdes'),
    nama: v.optional(v.string()),
    kategori: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    logoKey: v.optional(v.string()),
    deskripsi: v.optional(v.string()),
    fotoProduk: v.optional(v.array(v.string())),
    fotoProdukKeys: v.optional(v.array(v.string())),
    statusHukum: v.optional(v.string()),
    kontak: v.optional(v.string()),
    lokasi: v.optional(v.string()),
    mapsUrl: v.optional(v.string()),
    struktur: v.optional(v.array(
      v.object({
        jabatan: v.string(),
        nama: v.string(),
      })
    )),
    jumlahTenagaKerja: v.optional(v.number()),
    urutan: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteBumdes = mutation({
  args: { id: v.id('bumdes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
