import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  kategori_berita: defineTable({
    nama: v.string(),
    slug: v.string(),
  }).index('by_slug', ['slug']),

  berita: defineTable({
    title: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    imageKey: v.optional(v.string()),
    author: v.string(),
    slug: v.string(),
  })
    .index('by_slug', ['slug'])
    .index('by_category', ['category'])
    .index('by_author', ['author'])
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['category', 'author'],
    }),

  penduduk: defineTable({
    nik: v.string(),
    nama: v.string(),
    ttl: v.string(),
    jk: v.union(v.literal('Laki-laki'), v.literal('Perempuan')),
    rt: v.string(),
    rw: v.string(),
    status: v.string(), // "Kawin" | "Belum Kawin" | "Cerai Hidup" | "Cerai Mati"
    pekerjaan: v.string(),
  })
    .index('by_nik', ['nik'])
    .index('by_rt', ['rt'])
    .index('by_rw', ['rw'])
    .index('by_jk', ['jk'])
    .searchIndex('search_nama', {
      searchField: 'nama',
      filterFields: ['rt', 'rw', 'jk'],
    }),

  bansos: defineTable({
    nama: v.string(),
    nik: v.optional(v.string()),
    alamat: v.string(),
    jenisBansos: v.string(),
  })
    .index('by_nik', ['nik'])
    .index('by_jenisBansos', ['jenisBansos']),

  stunting: defineTable({
    nama: v.string(),
    nik: v.optional(v.string()),
    tanggalLahir: v.number(),
    jk: v.union(v.literal('L'), v.literal('P')),
    namaOrtu: v.string(),
    alamat: v.string(),
    pos: v.string(),
    bulan: v.number(),
    tahun: v.number(),
  })
    .index('by_alamat', ['alamat'])
    .index('by_pos', ['pos'])
    .index('by_periode', ['bulan', 'tahun']),

  apbdes_tahun: defineTable({
    tahun: v.number(),
    jenis: v.union(v.literal('Awal'), v.literal('Perubahan')),
    totalPendapatanSemula: v.optional(v.number()),
    totalPendapatan: v.number(), // Menjadi
    totalBelanjaSemula: v.optional(v.number()),
    totalBelanja: v.number(), // Menjadi
    pembiayaanNetto: v.number(),
    status: v.union(v.literal('Aktif'), v.literal('Arsip')),
  })
    .index('by_tahun', ['tahun'])
    .index('by_status', ['status']),

  apbdes: defineTable({
    tahunId: v.optional(v.id('apbdes_tahun')),
    kategori: v.optional(v.union(
      v.literal('Pendapatan'),
      v.literal('Belanja'),
      v.literal('Pembiayaan'),
    )),
    bidang: v.optional(v.string()), 
    subBidang: v.optional(v.string()), 
    kodeRekening: v.optional(v.string()),
    uraian: v.optional(v.string()), 
    nama: v.optional(v.string()), // old field
    nilai: v.optional(v.number()), // old field
    anggaranSemula: v.optional(v.number()), 
    anggaranMenjadi: v.optional(v.number()), 
    realisasi: v.optional(v.number()),
    sumberDana: v.optional(v.string()), 
  })
    .index('by_tahunId', ['tahunId'])
    .index('by_kategori', ['kategori'])
    .index('by_tahun_kategori', ['tahunId', 'kategori']),

  admin_users: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    nama: v.string(),
    role: v.union(
      v.literal('Superadmin'),
      v.literal('Editor Konten'),
      v.literal('Operator Infografis'),
      v.literal('Petugas Pengaduan'),
      v.literal('Editor'),
    ),
  }).index('by_username', ['username']),

  profil_desa: defineTable({
    visi: v.string(),
    misi: v.array(v.string()),
    sejarah: v.optional(v.string()),
    baganStrukturUrl: v.optional(v.string()),
    baganStrukturKey: v.optional(v.string()),
  }),

  kelembagaan: defineTable({
    nama: v.string(),
    singkatan: v.string(),
    logoUrl: v.string(),
    logoKey: v.optional(v.string()),
    deskripsi: v.optional(v.string()),
    urutan: v.number(),
  }).index('by_urutan', ['urutan']),

  pengurus_kelembagaan: defineTable({
    kelembagaanId: v.id('kelembagaan'),
    nama: v.string(),
    jabatan: v.string(),
    urutan: v.number(),
  })
    .index('by_kelembagaan', ['kelembagaanId'])
    .index('by_urutan', ['urutan']),

  perangkat_desa: defineTable({
    nama: v.string(),
    jabatan: v.string(),
    imageUrl: v.string(),
    imageKey: v.optional(v.string()),
    urutan: v.number(),
    status: v.union(v.literal('Aktif'), v.literal('Nonaktif')),
  })
    .index('by_urutan', ['urutan'])
    .index('by_status', ['status']),

  rt_rw: defineTable({
    nama: v.string(),
    dusun: v.string(),
    jabatan: v.union(v.literal('Ketua RT'), v.literal('Ketua RW')),
    rtRw: v.string(),
    urutan: v.number(),
    status: v.union(v.literal('Aktif'), v.literal('Nonaktif')),
  })
    .index('by_urutan', ['urutan'])
    .index('by_status', ['status'])
    .index('by_jabatan', ['jabatan']),

  beranda_config: defineTable({
    heroBadge: v.string(),
    heroTitle: v.string(),
    heroSubtitle: v.string(),
    heroImageUrl: v.string(),
    heroImageKey: v.optional(v.string()),
    kadesPeriode: v.string(),
    kadesSambutan: v.string(),
  }),

  kontak_config: defineTable({
    alamat: v.string(),
    teleponKantor: v.string(), // e.g., +62 822 5034 5977 (Kantor Desa)
    teleponDarurat: v.string(), // e.g., +62 811 2233 4455 (Darurat/WA)
    email: v.string(),
    jamPelayanan: v.string(),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    youtube: v.optional(v.string()),
  }),

  kategori_pengaduan: defineTable({
    nama: v.string(),
  }),

  pengaduan: defineTable({
    namaLengkap: v.string(),
    emailOrPhone: v.string(),
    kategoriId: v.id('kategori_pengaduan'),
    detailPesan: v.string(),
    status: v.optional(v.string()), // Legacy field
    tanggapan: v.optional(v.string()), // Legacy field
  })
    .index('by_emailOrPhone', ['emailOrPhone'])
    .index('by_kategori', ['kategoriId']),

  audit_logs: defineTable({
    adminUsername: v.string(),
    adminNama: v.string(),
    action: v.union(
      v.literal('INSERT'),
      v.literal('UPDATE'),
      v.literal('DELETE'),
    ),
    tableName: v.string(),
    recordId: v.string(),
    oldValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
    timestamp: v.number(),
  }).index('by_timestamp', ['timestamp']),

  turnstile_logs: defineTable({
    action: v.union(v.literal('login'), v.literal('pengaduan')),
    success: v.boolean(),
    visitorId: v.string(),
    errorMessage: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index('by_timestamp', ['timestamp'])
    .index('by_success', ['success'])
    .index('by_action', ['action'])
    .index('by_visitorId', ['visitorId']),

  demografi_summary: defineTable({
    totalPenduduk: v.number(),
    jumlahLaki: v.number(),
    jumlahPerempuan: v.number(),
    jumlahKK: v.number(),
    usiaProduktif: v.number(),
    usiaLanjut50Plus: v.number(),
  }),

  demografi_pekerjaan: defineTable({
    pekerjaan: v.string(),
    jumlahLaki: v.number(),
    jumlahPerempuan: v.number(),
    urutan: v.number(),
  }).index('by_urutan', ['urutan']),

  demografi_usia: defineTable({
    kelompokUsia: v.string(),
    jumlahLaki: v.number(),
    jumlahPerempuan: v.number(),
    urutan: v.number(),
  }).index('by_urutan', ['urutan']),

  demografi_pendidikan: defineTable({
    tingkat: v.string(),
    jumlahLaki: v.number(),
    jumlahPerempuan: v.number(),
    urutan: v.number(),
  }).index('by_urutan', ['urutan']),

  demografi_agama: defineTable({
    agama: v.string(),
    jumlahLaki: v.number(),
    jumlahPerempuan: v.number(),
    urutan: v.number(),
  }).index('by_urutan', ['urutan']),

  r2_settings: defineTable({
    preventiveEnabled: v.boolean(),
    dailyUploadLimit: v.number(), // Maksimal jumlah unggahan per hari
    dailyBandwidthLimit: v.number(), // Maksimal bandwidth per hari (dalam bytes)
    totalStorageBytes: v.optional(v.number()), // Total R2 storage in bytes (Cumulative)
  }),

  r2_uploads_log: defineTable({
    fileKey: v.string(),
    fileSize: v.number(), // dalam bytes
    timestamp: v.number(),
  })
    .index('by_timestamp', ['timestamp'])
    .index('by_fileKey', ['fileKey']),

  r2_monthly_usage: defineTable({
    month: v.string(), // Format: "YYYY-MM"
    classACount: v.number(),
    classBCount: v.number(),
  }).index('by_month', ['month']),
})
