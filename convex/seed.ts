import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed Admin Users
    const SEED_ADMINS: any[] = [
      { username: "admin", passwordHash: "password123", nama: "Admin Desa", role: "Superadmin" },
      { username: "editor", passwordHash: "editor123", nama: "Editor Konten", role: "Editor" },
    ];

    const existingAdmins = await ctx.db.query("admin_users").collect();
    for (const admin of SEED_ADMINS) {
      const match = existingAdmins.find(x => x.username === admin.username);
      if (match) {
        await ctx.db.patch(match._id, { passwordHash: admin.passwordHash, nama: admin.nama, role: admin.role });
      } else {
        await ctx.db.insert("admin_users", admin);
      }
    }

    // Cek apakah data penduduk sudah ada untuk seed data lainnya
    const existingPenduduk = await ctx.db.query("penduduk").first();
    if (existingPenduduk) {
      return { success: true, message: "Admin users updated/seeded, other tables already seeded" };
    }

    // Seed Data Penduduk
    const SEED_PENDUDUK: any[] = [
      { nik: "3505010101850001", nama: "Ahmad Subekti", ttl: "Blitar, 01-01-1985", jk: "Laki-laki", rt: "001", rw: "001", status: "Kawin", pekerjaan: "Petani" },
      { nik: "3505010201920002", nama: "Siti Rahayu", ttl: "Blitar, 02-01-1992", jk: "Perempuan", rt: "001", rw: "001", status: "Kawin", pekerjaan: "Ibu Rumah Tangga" },
      { nik: "3505011503870003", nama: "Bambang Setiawan", ttl: "Blitar, 15-03-1987", jk: "Laki-laki", rt: "002", rw: "001", status: "Kawin", pekerjaan: "Wiraswasta" },
    ];

    for (const p of SEED_PENDUDUK) {
      await ctx.db.insert("penduduk", p);
    }

    // Seed Data Bansos
    const SEED_BANSOS: any[] = [
      { nik: "3505010101850001", nama: "Ahmad Subekti", jk: "Laki-laki", rt: "001", rw: "001", jenisBansos: "PKH", nominal: "Rp 3.000.000", periode: "Jan – Des 2026", status: "Aktif" },
      { nik: "3505010201920002", nama: "Siti Rahayu", jk: "Perempuan", rt: "001", rw: "001", jenisBansos: "BPNT", nominal: "Rp 2.400.000", periode: "Jan – Des 2026", status: "Aktif" },
    ];

    for (const b of SEED_BANSOS) {
      await ctx.db.insert("bansos", b);
    }

    // Seed Data Stunting
    const SEED_STUNTING: any[] = [
      { nama: "Budi Kecil", dusun: "Sambigede", usia: "24", bb: "10.5", tb: "85", status: "Normal" },
      { nama: "Ani", dusun: "Paldoyong", usia: "36", bb: "11.2", tb: "88", status: "Risiko" },
    ];

    for (const s of SEED_STUNTING) {
      await ctx.db.insert("stunting", s);
    }

    // Seed Data APBDes
    const SEED_APBDES: any[] = [
      { nama: "Dana Desa (DD)", kategori: "Pendapatan", nilai: 850000000, realisasi: 850000000, sumberDana: "APBN" },
      { nama: "Pembangunan Infrastruktur", kategori: "Belanja", nilai: 450000000, realisasi: 400000000, sumberDana: "DD" },
    ];

    for (const a of SEED_APBDES) {
      await ctx.db.insert("apbdes", a);
    }

    return { success: true, message: "Database seeded successfully!" };
  },
});
