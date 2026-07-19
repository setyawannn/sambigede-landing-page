import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  kategori_berita: defineTable({
    nama: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),

  berita: defineTable({
    title: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    imageKey: v.optional(v.string()),
    author: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_author", ["author"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["category", "author"],
    }),

  penduduk: defineTable({
    nik: v.string(),
    nama: v.string(),
    ttl: v.string(),
    jk: v.union(v.literal("Laki-laki"), v.literal("Perempuan")),
    rt: v.string(),
    rw: v.string(),
    status: v.string(), // "Kawin" | "Belum Kawin" | "Cerai Hidup" | "Cerai Mati"
    pekerjaan: v.string(),
  })
    .index("by_nik", ["nik"])
    .index("by_rt", ["rt"])
    .index("by_rw", ["rw"])
    .index("by_jk", ["jk"])
    .searchIndex("search_nama", {
      searchField: "nama",
      filterFields: ["rt", "rw", "jk"],
    }),

  bansos: defineTable({
    nik: v.string(),
    nama: v.string(),
    jk: v.union(v.literal("Laki-laki"), v.literal("Perempuan"), v.literal("-")),
    rt: v.string(),
    rw: v.string(),
    jenisBansos: v.union(
      v.literal("PKH"),
      v.literal("BPNT"),
      v.literal("BLT Dana Desa"),
      v.literal("Bantuan Dana Pangan"),
      v.literal("Lainnya")
    ),
    nominal: v.string(),
    periode: v.string(),
    status: v.union(v.literal("Aktif"), v.literal("Selesai")),
  }).index("by_nik", ["nik"]).index("by_jenisBansos", ["jenisBansos"]),

  stunting: defineTable({
    nama: v.string(),
    dusun: v.string(),
    usia: v.string(),
    bb: v.string(),
    tb: v.string(),
    status: v.union(v.literal("Normal"), v.literal("Risiko"), v.literal("Stunting")),
  }).index("by_dusun", ["dusun"]).index("by_status", ["status"]),

  apbdes: defineTable({
    nama: v.string(),
    kategori: v.union(v.literal("Pendapatan"), v.literal("Belanja"), v.literal("Pembiayaan")),
    nilai: v.number(),
    realisasi: v.number(),
    sumberDana: v.string(),
  }).index("by_kategori", ["kategori"]),

  admin_users: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    nama: v.string(),
    role: v.union(v.literal("Superadmin"), v.literal("Editor")),
  }).index("by_username", ["username"]),

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
  }).index("by_urutan", ["urutan"]),

  pengurus_kelembagaan: defineTable({
    kelembagaanId: v.id("kelembagaan"),
    nama: v.string(),
    jabatan: v.string(),
    urutan: v.number(),
  }).index("by_kelembagaan", ["kelembagaanId"]).index("by_urutan", ["urutan"]),

  perangkat_desa: defineTable({
    nama: v.string(),
    jabatan: v.string(),
    imageUrl: v.string(),
    imageKey: v.optional(v.string()),
    urutan: v.number(),
    status: v.union(v.literal("Aktif"), v.literal("Nonaktif")),
  }).index("by_urutan", ["urutan"]).index("by_status", ["status"]),

  beranda_config: defineTable({
    heroBadge: v.string(),
    heroTitle: v.string(),
    heroSubtitle: v.string(),
    heroImageUrl: v.string(),
    heroImageKey: v.optional(v.string()),
    kadesPeriode: v.string(),
    kadesSambutan: v.string(),
  }),
});
