import { v } from 'convex/values'
import { action, internalMutation, mutation, query } from './_generated/server'
import { internal } from './_generated/api'
import { verifyTurnstile } from './turnstile'

export const getKategoriList = query({
  handler: async (ctx) => {
    return await ctx.db.query('kategori_pengaduan').collect()
  },
})

export const getPengaduanList = query({
  handler: async (ctx) => {
    const pengaduan = await ctx.db.query('pengaduan').order('desc').collect()
    // Resolve category name for each pengaduan
    return await Promise.all(
      pengaduan.map(async (p) => {
        const kategori = await ctx.db.get(p.kategoriId)
        return {
          ...p,
          kategoriNama: kategori ? kategori.nama : 'Tidak Diketahui',
        }
      }),
    )
  },
})

export const getAuditLogs = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('audit_logs')
      .withIndex('by_timestamp')
      .order('desc')
      .collect()
  },
})

export const insertPengaduanInternal = internalMutation({
  args: {
    namaLengkap: v.string(),
    emailOrPhone: v.string(),
    kategoriId: v.id('kategori_pengaduan'),
    detailPesan: v.string(),
  },
  handler: async (ctx, args) => {
    // Rate Limiting: Max 3 submissions in the last 15 minutes per emailOrPhone
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000
    const recentSubmissions = await ctx.db
      .query('pengaduan')
      .withIndex('by_emailOrPhone', (q) =>
        q.eq('emailOrPhone', args.emailOrPhone),
      )
      .filter((q) => q.gt(q.field('_creationTime'), fifteenMinutesAgo))
      .collect()

    if (recentSubmissions.length >= 3) {
      throw new Error(
        'Anda telah mencapai batas maksimal pengiriman. Silakan coba lagi nanti.',
      )
    }

    await ctx.db.insert('pengaduan', {
      namaLengkap: args.namaLengkap,
      emailOrPhone: args.emailOrPhone,
      kategoriId: args.kategoriId,
      detailPesan: args.detailPesan,
    })
  },
})

export const insertPengaduan = action({
  args: {
    namaLengkap: v.string(),
    emailOrPhone: v.string(),
    kategoriId: v.id('kategori_pengaduan'),
    detailPesan: v.string(),
    turnstileToken: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await verifyTurnstile(args.turnstileToken)

    await ctx.runMutation(internal.analytics.logTurnstileAttempt, {
      action: 'pengaduan',
      success: result.success,
      visitorId: args.visitorId,
      errorMessage: result.errorMessage,
    })

    if (!result.success) {
      throw new Error('Verifikasi keamanan gagal (Robot terdeteksi).')
    }

    await ctx.runMutation(internal.pengaduan.insertPengaduanInternal, {
      namaLengkap: args.namaLengkap,
      emailOrPhone: args.emailOrPhone,
      kategoriId: args.kategoriId,
      detailPesan: args.detailPesan,
    })
  },
})

export const deletePengaduan = mutation({
  args: {
    id: v.id('pengaduan'),
    adminUser: v.object({
      username: v.string(),
      nama: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.id)
    if (!target) throw new Error('Pengaduan tidak ditemukan')

    await ctx.db.insert('audit_logs', {
      adminUsername: args.adminUser.username,
      adminNama: args.adminUser.nama,
      action: 'DELETE',
      tableName: 'pengaduan',
      recordId: args.id,
      oldValue: JSON.stringify(target),
      timestamp: Date.now(),
    })

    await ctx.db.delete(args.id)
  },
})

// Master Kategori CRUD
export const insertKategori = mutation({
  args: {
    nama: v.string(),
    adminUser: v.object({
      username: v.string(),
      nama: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert('kategori_pengaduan', {
      nama: args.nama,
    })

    await ctx.db.insert('audit_logs', {
      adminUsername: args.adminUser.username,
      adminNama: args.adminUser.nama,
      action: 'INSERT',
      tableName: 'kategori_pengaduan',
      recordId: newId,
      newValue: JSON.stringify({ nama: args.nama }),
      timestamp: Date.now(),
    })
  },
})

export const updateKategori = mutation({
  args: {
    id: v.id('kategori_pengaduan'),
    nama: v.string(),
    adminUser: v.object({
      username: v.string(),
      nama: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.id)
    if (!target) throw new Error('Kategori tidak ditemukan')

    await ctx.db.insert('audit_logs', {
      adminUsername: args.adminUser.username,
      adminNama: args.adminUser.nama,
      action: 'UPDATE',
      tableName: 'kategori_pengaduan',
      recordId: args.id,
      oldValue: JSON.stringify({ nama: target.nama }),
      newValue: JSON.stringify({ nama: args.nama }),
      timestamp: Date.now(),
    })

    await ctx.db.patch(args.id, { nama: args.nama })
  },
})

export const deleteKategori = mutation({
  args: {
    id: v.id('kategori_pengaduan'),
    adminUser: v.object({
      username: v.string(),
      nama: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.id)
    if (!target) throw new Error('Kategori tidak ditemukan')

    // Check if category is in use
    const relatedPengaduan = await ctx.db
      .query('pengaduan')
      .withIndex('by_kategori', (q) => q.eq('kategoriId', args.id))
      .first()

    if (relatedPengaduan) {
      throw new Error(
        'Kategori tidak dapat dihapus karena masih digunakan pada pengaduan.',
      )
    }

    await ctx.db.insert('audit_logs', {
      adminUsername: args.adminUser.username,
      adminNama: args.adminUser.nama,
      action: 'DELETE',
      tableName: 'kategori_pengaduan',
      recordId: args.id,
      oldValue: JSON.stringify(target),
      timestamp: Date.now(),
    })

    await ctx.db.delete(args.id)
  },
})
