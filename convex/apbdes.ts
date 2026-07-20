import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// ==============================
// APBDES TAHUN (SUMMARY)
// ==============================

export const getApbdesTahunList = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('apbdes_tahun').order('desc').collect()
  },
})

export const getApbdesTahunActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('apbdes_tahun')
      .withIndex('by_status', (q) => q.eq('status', 'Aktif'))
      .first()
  },
})

export const setActiveTahun = mutation({
  args: { id: v.id('apbdes_tahun') },
  handler: async (ctx, args) => {
    // Set all to Arsip
    const all = await ctx.db.query('apbdes_tahun').collect()
    for (const item of all) {
      if (item.status === 'Aktif') {
        await ctx.db.patch(item._id, { status: 'Arsip' })
      }
    }
    // Set the requested to Aktif
    await ctx.db.patch(args.id, { status: 'Aktif' })
  },
})

export const deleteApbdesTahun = mutation({
  args: { id: v.id('apbdes_tahun') },
  handler: async (ctx, args) => {
    // Delete all child items first
    const items = await ctx.db
      .query('apbdes')
      .withIndex('by_tahunId', (q) => q.eq('tahunId', args.id))
      .collect()
    for (const item of items) {
      await ctx.db.delete(item._id)
    }
    // Delete the year summary
    await ctx.db.delete(args.id)
  },
})

// ==============================
// APBDES ITEMS (RINCIAN)
// ==============================

export const getApbdesByTahunId = query({
  args: { tahunId: v.optional(v.id('apbdes_tahun')) },
  handler: async (ctx, args) => {
    const { tahunId } = args
    if (!tahunId) return []
    return await ctx.db
      .query('apbdes')
      .withIndex('by_tahunId', (q) => q.eq('tahunId', tahunId))
      .collect()
  },
})

export const getActiveApbdesItems = query({
  args: {},
  handler: async (ctx) => {
    const activeTahun = await ctx.db
      .query('apbdes_tahun')
      .withIndex('by_status', (q) => q.eq('status', 'Aktif'))
      .first()
    
    if (!activeTahun) return []

    return await ctx.db
      .query('apbdes')
      .withIndex('by_tahunId', (q) => q.eq('tahunId', activeTahun._id))
      .collect()
  },
})

// BATCH IMPORT
export const importApbdesBatch = mutation({
  args: {
    tahunData: v.object({
      tahun: v.number(),
      jenis: v.union(v.literal('Awal'), v.literal('Perubahan')),
      totalPendapatanSemula: v.optional(v.number()),
      totalPendapatan: v.number(),
      totalBelanjaSemula: v.optional(v.number()),
      totalBelanja: v.number(),
      pembiayaanNetto: v.number(),
      status: v.union(v.literal('Aktif'), v.literal('Arsip')),
    }),
    items: v.array(
      v.object({
        kategori: v.union(
          v.literal('Pendapatan'),
          v.literal('Belanja'),
          v.literal('Pembiayaan'),
        ),
        bidang: v.optional(v.string()),
        subBidang: v.optional(v.string()),
        kodeRekening: v.optional(v.string()),
        uraian: v.string(),
        anggaranSemula: v.optional(v.number()),
        anggaranMenjadi: v.number(),
        realisasi: v.optional(v.number()),
        sumberDana: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Ensure if we create an 'Aktif' year, we archive others
    if (args.tahunData.status === 'Aktif') {
      const allActive = await ctx.db
        .query('apbdes_tahun')
        .withIndex('by_status', (q) => q.eq('status', 'Aktif'))
        .collect()
      for (const act of allActive) {
        await ctx.db.patch(act._id, { status: 'Arsip' })
      }
    }

    // Insert new Tahun
    const tahunId = await ctx.db.insert('apbdes_tahun', args.tahunData)

    // Insert all items
    for (const item of args.items) {
      await ctx.db.insert('apbdes', {
        tahunId,
        ...item,
      })
    }

    return { success: true, count: args.items.length }
  },
})

// MANUAL CRUD
export const createApbdesItem = mutation({
  args: {
    tahunId: v.id('apbdes_tahun'),
    kategori: v.union(
      v.literal('Pendapatan'),
      v.literal('Belanja'),
      v.literal('Pembiayaan'),
    ),
    bidang: v.optional(v.string()),
    subBidang: v.optional(v.string()),
    kodeRekening: v.optional(v.string()),
    uraian: v.string(),
    anggaranSemula: v.optional(v.number()),
    anggaranMenjadi: v.number(),
    realisasi: v.optional(v.number()),
    sumberDana: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('apbdes', args)
  },
})

export const updateApbdesItem = mutation({
  args: {
    id: v.id('apbdes'),
    kategori: v.optional(
      v.union(
        v.literal('Pendapatan'),
        v.literal('Belanja'),
        v.literal('Pembiayaan'),
      ),
    ),
    bidang: v.optional(v.string()),
    subBidang: v.optional(v.string()),
    kodeRekening: v.optional(v.string()),
    uraian: v.optional(v.string()),
    anggaranSemula: v.optional(v.number()),
    anggaranMenjadi: v.optional(v.number()),
    realisasi: v.optional(v.number()),
    sumberDana: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deleteApbdesItem = mutation({
  args: { id: v.id('apbdes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
