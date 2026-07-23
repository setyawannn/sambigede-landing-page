import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// --- Koperasi ---

export const getKoperasiList = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('koperasi').withIndex('by_urutan').collect()
  },
})

export const getKoperasiById = query({
  args: { id: v.id('koperasi') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createKoperasi = mutation({
  args: {
    nama: v.string(),
    jenis: v.string(),
    logoUrl: v.optional(v.string()),
    logoKey: v.optional(v.string()),
    deskripsi: v.string(),
    fotoKegiatan: v.optional(v.array(v.string())),
    fotoKegiatanKeys: v.optional(v.array(v.string())),
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
    jumlahAnggota: v.number(),
    urutan: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('koperasi', args)
  },
})

export const updateKoperasi = mutation({
  args: {
    id: v.id('koperasi'),
    nama: v.optional(v.string()),
    jenis: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    logoKey: v.optional(v.string()),
    deskripsi: v.optional(v.string()),
    fotoKegiatan: v.optional(v.array(v.string())),
    fotoKegiatanKeys: v.optional(v.array(v.string())),
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
    jumlahAnggota: v.optional(v.number()),
    urutan: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteKoperasi = mutation({
  args: { id: v.id('koperasi') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
