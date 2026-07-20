import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getPenduduk = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('penduduk').collect()
  },
})

export const getPendudukFiltered = query({
  args: {
    nama: v.optional(v.string()),
    rt: v.optional(v.string()),
    rw: v.optional(v.string()),
    jk: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q: any = ctx.db.query('penduduk')

    // Use search index if nama is provided
    if (args.nama && args.nama.trim() !== '') {
      const namaSearch = args.nama.trim()
      return await ctx.db
        .query('penduduk')
        .withSearchIndex('search_nama', (q) => {
          let search = q.search('nama', namaSearch)
          if (args.rt && args.rt !== 'Semua') {
            search = search.eq('rt', args.rt)
          }
          if (args.rw && args.rw !== 'Semua') {
            search = search.eq('rw', args.rw)
          }
          if (args.jk && args.jk !== 'Semua') {
            search = search.eq('jk', args.jk as 'Laki-laki' | 'Perempuan')
          }
          return search
        })
        .collect()
    }

    // Otherwise use regular indexes if only one filter is provided, or just filter
    if (args.rt && args.rt !== 'Semua') {
      q = q.withIndex('by_rt', (dbQ: any) => dbQ.eq('rt', args.rt!))
    } else if (args.rw && args.rw !== 'Semua') {
      q = q.withIndex('by_rw', (dbQ: any) => dbQ.eq('rw', args.rw!))
    } else if (args.jk && args.jk !== 'Semua') {
      q = q.withIndex('by_jk', (dbQ: any) => dbQ.eq('jk', args.jk))
    }

    // Filter remaining conditions
    q = q.filter((dbQ: any) => {
      const conds = []
      if (args.rt && args.rt !== 'Semua' && q.indexName !== 'by_rt') {
        conds.push(dbQ.eq(dbQ.field('rt'), args.rt))
      }
      if (args.rw && args.rw !== 'Semua' && q.indexName !== 'by_rw') {
        conds.push(dbQ.eq(dbQ.field('rw'), args.rw))
      }
      if (args.jk && args.jk !== 'Semua' && q.indexName !== 'by_jk') {
        conds.push(dbQ.eq(dbQ.field('jk'), args.jk))
      }

      if (conds.length === 0) return true
      if (conds.length === 1) return conds[0]
      return dbQ.and(...conds)
    })

    return await q.collect()
  },
})

export const getPendudukByNik = query({
  args: { nik: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('penduduk')
      .withIndex('by_nik', (q) => q.eq('nik', args.nik))
      .first()
  },
})

export const batchInsertPenduduk = mutation({
  args: {
    data: v.array(
      v.object({
        nik: v.string(),
        nama: v.string(),
        ttl: v.string(),
        jk: v.union(v.literal('Laki-laki'), v.literal('Perempuan')),
        rt: v.string(),
        rw: v.string(),
        status: v.string(),
        pekerjaan: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.insert('penduduk', item)
    }
    return { success: true, count: args.data.length }
  },
})

export const clearPenduduk = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('penduduk').collect()
    for (const item of all) {
      await ctx.db.delete(item._id)
    }
    return { success: true, count: all.length }
  },
})

export const createPenduduk = mutation({
  args: {
    nik: v.string(),
    nama: v.string(),
    ttl: v.string(),
    jk: v.union(v.literal('Laki-laki'), v.literal('Perempuan')),
    rt: v.string(),
    rw: v.string(),
    status: v.string(),
    pekerjaan: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('penduduk', args)
  },
})

export const updatePenduduk = mutation({
  args: {
    id: v.id('penduduk'),
    nik: v.optional(v.string()),
    nama: v.optional(v.string()),
    ttl: v.optional(v.string()),
    jk: v.optional(v.union(v.literal('Laki-laki'), v.literal('Perempuan'))),
    rt: v.optional(v.string()),
    rw: v.optional(v.string()),
    status: v.optional(v.string()),
    pekerjaan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const deletePenduduk = mutation({
  args: { id: v.id('penduduk') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
