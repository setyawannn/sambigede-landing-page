import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// SUMMARY
export const getSummary = query({
  args: {},
  handler: async (ctx) => {
    const summary = await ctx.db.query('demografi_summary').first()
    return summary
  },
})

export const updateSummary = mutation({
  args: {
    totalPenduduk: v.number(),
    jumlahLaki: v.number(),
    jumlahPerempuan: v.number(),
    jumlahKK: v.number(),
    usiaProduktif: v.number(),
    usiaLanjut50Plus: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('demografi_summary').first()
    if (existing) {
      await ctx.db.patch(existing._id, args)
    } else {
      await ctx.db.insert('demografi_summary', args)
    }
    return { success: true }
  },
})

// PEKERJAAN
export const getPekerjaan = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('demografi_pekerjaan')
      .withIndex('by_urutan')
      .collect()
  },
})

export const savePekerjaan = mutation({
  args: {
    data: v.array(
      v.object({
        _id: v.optional(v.id('demografi_pekerjaan')),
        pekerjaan: v.string(),
        jumlahLaki: v.number(),
        jumlahPerempuan: v.number(),
        urutan: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Delete ones not in the list
    const existing = await ctx.db.query('demografi_pekerjaan').collect()
    const incomingIds = args.data.map((d) => d._id).filter(Boolean)
    for (const item of existing) {
      if (!incomingIds.includes(item._id)) {
        await ctx.db.delete(item._id)
      }
    }
    // Update or Insert
    for (const item of args.data) {
      if (item._id) {
        const { _id, ...updates } = item
        await ctx.db.patch(_id, updates)
      } else {
        await ctx.db.insert('demografi_pekerjaan', {
          pekerjaan: item.pekerjaan,
          jumlahLaki: item.jumlahLaki,
          jumlahPerempuan: item.jumlahPerempuan,
          urutan: item.urutan,
        })
      }
    }
    return { success: true }
  },
})

// USIA
export const getUsia = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('demografi_usia').withIndex('by_urutan').collect()
  },
})

export const saveUsia = mutation({
  args: {
    data: v.array(
      v.object({
        _id: v.id('demografi_usia'),
        jumlahLaki: v.number(),
        jumlahPerempuan: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.patch(item._id, {
        jumlahLaki: item.jumlahLaki,
        jumlahPerempuan: item.jumlahPerempuan,
      })
    }
    return { success: true }
  },
})

// PENDIDIKAN
export const getPendidikan = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('demografi_pendidikan')
      .withIndex('by_urutan')
      .collect()
  },
})

export const savePendidikan = mutation({
  args: {
    data: v.array(
      v.object({
        _id: v.id('demografi_pendidikan'),
        jumlahLaki: v.number(),
        jumlahPerempuan: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.patch(item._id, {
        jumlahLaki: item.jumlahLaki,
        jumlahPerempuan: item.jumlahPerempuan,
      })
    }
    return { success: true }
  },
})

// AGAMA
export const getAgama = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('demografi_agama')
      .withIndex('by_urutan')
      .collect()
  },
})

export const saveAgama = mutation({
  args: {
    data: v.array(
      v.object({
        _id: v.id('demografi_agama'),
        jumlahLaki: v.number(),
        jumlahPerempuan: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.patch(item._id, {
        jumlahLaki: item.jumlahLaki,
        jumlahPerempuan: item.jumlahPerempuan,
      })
    }
    return { success: true }
  },
})

export const seedDemografiData = mutation({
  args: {},
  handler: async (ctx) => {
    // Summary
    const existingSummary = await ctx.db.query('demografi_summary').first()
    if (!existingSummary) {
      await ctx.db.insert('demografi_summary', {
        totalPenduduk: 5175,
        jumlahLaki: 2600,
        jumlahPerempuan: 2575,
        jumlahKK: 1832,
        usiaProduktif: 2680,
        usiaLanjut50Plus: 1682,
      })
    }

    // Pekerjaan
    const pekerjaanData = [
      {
        pekerjaan: 'BELUM/TIDAK BEKERJA',
        jumlahLaki: 518,
        jumlahPerempuan: 515,
      },
      {
        pekerjaan: 'MENGURUS RUMAH TANGGA',
        jumlahLaki: 0,
        jumlahPerempuan: 227,
      },
      { pekerjaan: 'PELAJAR/MAHASISWA', jumlahLaki: 401, jumlahPerempuan: 291 },
      { pekerjaan: 'PENSIUNAN', jumlahLaki: 10, jumlahPerempuan: 6 },
      {
        pekerjaan: 'PEGAWAI NEGERI SIPIL (PNS)',
        jumlahLaki: 6,
        jumlahPerempuan: 9,
      },
      {
        pekerjaan: 'TENTARA NASIONAL INDONESIA (TNI)',
        jumlahLaki: 3,
        jumlahPerempuan: 0,
      },
      { pekerjaan: 'KEPOLISIAN RI (POLRI)', jumlahLaki: 1, jumlahPerempuan: 0 },
      { pekerjaan: 'PERDAGANGAN', jumlahLaki: 51, jumlahPerempuan: 40 },
      { pekerjaan: 'PETANI/PEKEBUN', jumlahLaki: 749, jumlahPerempuan: 861 },
      { pekerjaan: 'PETERNAK', jumlahLaki: 2, jumlahPerempuan: 3 },
      { pekerjaan: 'KONSTRUKSI', jumlahLaki: 1, jumlahPerempuan: 0 },
      { pekerjaan: 'TRANSPORTASI', jumlahLaki: 1, jumlahPerempuan: 0 },
      { pekerjaan: 'KARYAWAN SWASTA', jumlahLaki: 392, jumlahPerempuan: 283 },
      { pekerjaan: 'KARYAWAN HONORER', jumlahLaki: 2, jumlahPerempuan: 2 },
      { pekerjaan: 'BURUH HARIAN LEPAS', jumlahLaki: 12, jumlahPerempuan: 2 },
      {
        pekerjaan: 'BURUH TANI/PERKEBUNAN',
        jumlahLaki: 11,
        jumlahPerempuan: 12,
      },
      { pekerjaan: 'PEMBANTU RUMAH TANGGA', jumlahLaki: 0, jumlahPerempuan: 6 },
      { pekerjaan: 'TUKANG LISTRIK', jumlahLaki: 1, jumlahPerempuan: 0 },
      { pekerjaan: 'TUKANG BATU', jumlahLaki: 7, jumlahPerempuan: 0 },
      { pekerjaan: 'TUKANG KAYU', jumlahLaki: 7, jumlahPerempuan: 0 },
      {
        pekerjaan: 'TUKANG LAS/PANDAI BESI',
        jumlahLaki: 2,
        jumlahPerempuan: 0,
      },
      { pekerjaan: 'TUKANG JAHIT', jumlahLaki: 1, jumlahPerempuan: 3 },
      { pekerjaan: 'PENATA RAMBUT', jumlahLaki: 2, jumlahPerempuan: 0 },
      { pekerjaan: 'MEKANIK', jumlahLaki: 2, jumlahPerempuan: 0 },
      { pekerjaan: 'GURU', jumlahLaki: 3, jumlahPerempuan: 10 },
      { pekerjaan: 'BIDAN', jumlahLaki: 0, jumlahPerempuan: 3 },
      { pekerjaan: 'PERAWAT', jumlahLaki: 2, jumlahPerempuan: 5 },
      { pekerjaan: 'SOPIR', jumlahLaki: 7, jumlahPerempuan: 0 },
      { pekerjaan: 'PEDAGANG', jumlahLaki: 94, jumlahPerempuan: 73 },
      { pekerjaan: 'WIRASWASTA', jumlahLaki: 295, jumlahPerempuan: 217 },
      { pekerjaan: 'PEKERJAAN LAINNYA', jumlahLaki: 17, jumlahPerempuan: 7 },
    ]

    const existingPekerjaan = await ctx.db
      .query('demografi_pekerjaan')
      .collect()
    if (existingPekerjaan.length === 0) {
      for (let i = 0; i < pekerjaanData.length; i++) {
        await ctx.db.insert('demografi_pekerjaan', {
          ...pekerjaanData[i],
          urutan: i + 1,
        })
      }
    }

    // Usia
    const usiaData = [
      { kelompokUsia: '00 - 14 TAHUN', jumlahLaki: 460, jumlahPerempuan: 389 },
      { kelompokUsia: '15 - 19 TAHUN', jumlahLaki: 200, jumlahPerempuan: 177 },
      {
        kelompokUsia: '20 - 59 TAHUN',
        jumlahLaki: 1429,
        jumlahPerempuan: 1466,
      },
      { kelompokUsia: '>= 60 TAHUN', jumlahLaki: 511, jumlahPerempuan: 543 },
    ]
    const existingUsia = await ctx.db.query('demografi_usia').collect()
    if (existingUsia.length === 0) {
      for (let i = 0; i < usiaData.length; i++) {
        await ctx.db.insert('demografi_usia', { ...usiaData[i], urutan: i + 1 })
      }
    }

    // Pendidikan
    const pendidikanData = [
      { tingkat: 'TIDAK/BLM SEKOLAH', jumlahLaki: 495, jumlahPerempuan: 545 },
      {
        tingkat: 'BELUM TAMAT SD/SEDERAJAT',
        jumlahLaki: 327,
        jumlahPerempuan: 312,
      },
      { tingkat: 'TAMAT SD/SEDERAJAT', jumlahLaki: 858, jumlahPerempuan: 882 },
      { tingkat: 'SLTP/SEDERAJAT', jumlahLaki: 497, jumlahPerempuan: 480 },
      { tingkat: 'SLTA/SEDERAJAT', jumlahLaki: 368, jumlahPerempuan: 293 },
      { tingkat: 'DIPLOMA I/II', jumlahLaki: 4, jumlahPerempuan: 6 },
      {
        tingkat: 'AKADEMI/DIPLOMA III/SARJANA MUDA',
        jumlahLaki: 6,
        jumlahPerempuan: 10,
      },
      { tingkat: 'DIPLOMA IV/STRATA I', jumlahLaki: 45, jumlahPerempuan: 47 },
    ]
    const existingPendidikan = await ctx.db
      .query('demografi_pendidikan')
      .collect()
    if (existingPendidikan.length === 0) {
      for (let i = 0; i < pendidikanData.length; i++) {
        await ctx.db.insert('demografi_pendidikan', {
          ...pendidikanData[i],
          urutan: i + 1,
        })
      }
    }

    // Agama
    const agamaData = [
      { agama: 'ISLAM', jumlahLaki: 2594, jumlahPerempuan: 2570 },
      { agama: 'KRISTEN', jumlahLaki: 6, jumlahPerempuan: 5 },
    ]
    const existingAgama = await ctx.db.query('demografi_agama').collect()
    if (existingAgama.length === 0) {
      for (let i = 0; i < agamaData.length; i++) {
        await ctx.db.insert('demografi_agama', {
          ...agamaData[i],
          urutan: i + 1,
        })
      }
    }

    return { success: true }
  },
})
