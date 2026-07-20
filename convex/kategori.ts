import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getKategori = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('kategori_berita').order('asc').collect()
  },
})

export const getKategoriBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('kategori_berita')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()
  },
})

export const createKategori = mutation({
  args: {
    nama: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if slug exists
    const existing = await ctx.db
      .query('kategori_berita')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()

    if (existing) {
      throw new Error('Kategori dengan slug ini sudah ada.')
    }

    return await ctx.db.insert('kategori_berita', args)
  },
})

export const updateKategori = mutation({
  args: {
    id: v.id('kategori_berita'),
    nama: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, nama, slug } = args

    // Check if new slug exists on other records
    const existing = await ctx.db
      .query('kategori_berita')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first()

    if (existing && existing._id !== id) {
      throw new Error('Kategori dengan slug ini sudah ada.')
    }

    return await ctx.db.patch(id, { nama, slug })
  },
})

export const deleteKategori = mutation({
  args: { id: v.id('kategori_berita') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
