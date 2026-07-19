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

    // Seed Kategori Berita
    const SEED_KATEGORI: any[] = [
      { nama: "Pembangunan", slug: "pembangunan" },
      { nama: "Pemerintahan", slug: "pemerintahan" },
      { nama: "Kesehatan", slug: "kesehatan" },
      { nama: "Pendidikan", slug: "pendidikan" },
    ];

    const existingKategori = await ctx.db.query("kategori_berita").collect();
    for (const kat of SEED_KATEGORI) {
      const match = existingKategori.find(x => x.slug === kat.slug);
      if (!match) {
        await ctx.db.insert("kategori_berita", kat);
      }
    }

    // Cek apakah data penduduk sudah ada untuk seed data lainnya
    const existingPenduduk = await ctx.db.query("penduduk").first();
    if (existingPenduduk) {
      return { success: true, message: "Admin users & Kategori seeded, other tables already seeded" };
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

    // Seed Profil Desa
    const existingProfil = await ctx.db.query("profil_desa").first();
    if (!existingProfil) {
      await ctx.db.insert("profil_desa", {
        visi: "Terwujudnya Desa Sambigede Yang Mandiri, Sejahtera, Agamis, dan Berbudaya Melalui Tata Kelola Pemerintahan Yang Bersih dan Inovatif.",
        misi: [
          "Meningkatkan kualitas pelayanan publik melalui digitalisasi dan transparansi.",
          "Membangun dan memelihara infrastruktur desa yang berkualitas secara merata.",
          "Pemberdayaan ekonomi kerakyatan melalui BUMDes dan kelompok usaha tani.",
          "Meningkatkan kualitas kesehatan, pendidikan, dan kerukunan antar warga."
        ],
        sejarah: "Desa Sambigede adalah desa yang kaya akan potensi alam dan budaya.",
      });
    }

    // Seed Beranda Config
    const existingBeranda = await ctx.db.query("beranda_config").first();
    if (!existingBeranda) {
      await ctx.db.insert("beranda_config", {
        heroBadge: "Transformasi Menuju Desa Digital",
        heroTitle: "Selamat Datang di \n Desa Sambigede",
        heroSubtitle: "Website Resmi Desa Sambigede. Sumber informasi terbaru tentang pemerintahan yang berorientasi pada keterbukaan informasi publik.",
        heroImageUrl: "https://images.unsplash.com/photo-1662083555510-1187b2aba1e2?auto=format&fit=crop&w=1920&q=80",
        kadesPeriode: "Periode 2024 - 2029",
        kadesSambutan: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi Desa Sambigede, Kecamatan Binangun, Kabupaten Blitar. Melalui portal website ini, kami berharap dapat memberikan transparansi informasi pemerintahan, mempermudah pelayanan administrasi, dan memperkenalkan seluruh potensi unggulan Desa Sambigede kepada masyarakat luas.",
      });
    }

    // Seed Kelembagaan (Sample)
    const existingKelembagaan = await ctx.db.query("kelembagaan").first();
    if (!existingKelembagaan) {
      const bpdId = await ctx.db.insert("kelembagaan", {
        nama: "Badan Permusyawaratan Desa",
        singkatan: "BPD",
        logoUrl: "", // Akan diupdate via admin
        deskripsi: "Lembaga perwujudan demokrasi dalam penyelenggaraan pemerintahan desa.",
        urutan: 1,
      });

      await ctx.db.insert("pengurus_kelembagaan", {
        kelembagaanId: bpdId,
        nama: "CH.A.ALI WAHYUDI, S.E",
        jabatan: "Ketua (merangkap anggota)",
        urutan: 1,
      });
    }

    // Seed Perangkat Desa
    const existingPerangkat = await ctx.db.query("perangkat_desa").first();
    if (!existingPerangkat) {
      const perangkatList = [
        { nama: "Roihan Al Madzhar", jabatan: "Kepala Desa" },
        { nama: "Agus Anang Styobudi, S.Kom", jabatan: "Sekretaris Desa" },
        { nama: "Budi Kurniawan, S.Pd.SD", jabatan: "Kasi Pemerintahan" },
        { nama: "Suhadi", jabatan: "Kasi Kesejahteraan" },
        { nama: "Siti Nur Kolifah, S.Ak", jabatan: "Kasi Pelayanan" },
        { nama: "Agus Wiyono", jabatan: "Kaur Tata Usaha & Umum" },
        { nama: "Sunarmi", jabatan: "Kaur Keuangan" },
        { nama: "Bibit Hasanuddin", jabatan: "Kaur Perencanaan" },
        { nama: "Sundari", jabatan: "Kamituwo Dusun Sambigede" },
        { nama: "Pitantoro", jabatan: "Kamituwo Dusun Paldoyong" },
        { nama: "Imam Mahfud", jabatan: "Karyawan Desa (Staf Kewilayahan)" },
        { nama: "Muhyiddin", jabatan: "Karyawan Desa (Modin Islam)" },
        { nama: "Riadi", jabatan: "Karyawan Desa (Kebersihan Kantor)" }
      ];

      for (let i = 0; i < perangkatList.length; i++) {
        await ctx.db.insert("perangkat_desa", {
          nama: perangkatList[i].nama,
          jabatan: perangkatList[i].jabatan,
          imageUrl: "",
          urutan: i + 1,
          status: "Aktif",
        });
      }
    }
    
    return { success: true, message: "Database seeded successfully with Profil & Kelembagaan!" };
  },
});
