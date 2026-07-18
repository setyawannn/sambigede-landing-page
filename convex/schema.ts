import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  berita: defineTable({
    title: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    imageKey: v.optional(v.string()),
    author: v.string(),
  }).index("by_category", ["category"]),

  penduduk: defineTable({
    nik: v.string(),
    nama: v.string(),
    ttl: v.string(),
    jk: v.union(v.literal("Laki-laki"), v.literal("Perempuan")),
    rt: v.string(),
    rw: v.string(),
    status: v.string(), // "Kawin" | "Belum Kawin" | "Cerai Hidup" | "Cerai Mati"
    pekerjaan: v.string(),
  }).index("by_nik", ["nik"]),

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
});
