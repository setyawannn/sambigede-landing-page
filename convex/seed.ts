import { mutation } from './_generated/server'

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed Admin Users
    const SEED_ADMINS: any[] = [
      {
        username: 'admin',
        passwordHash: 'password123',
        nama: 'Admin Desa',
        role: 'Superadmin',
      },
      {
        username: 'editor',
        passwordHash: 'editor123',
        nama: 'Editor Konten',
        role: 'Editor',
      },
    ]

    const existingAdmins = await ctx.db.query('admin_users').collect()
    for (const admin of SEED_ADMINS) {
      const match = existingAdmins.find((x) => x.username === admin.username)
      if (match) {
        await ctx.db.patch(match._id, {
          passwordHash: admin.passwordHash,
          nama: admin.nama,
          role: admin.role,
        })
      } else {
        await ctx.db.insert('admin_users', admin)
      }
    }

    // Seed Kategori Berita
    const SEED_KATEGORI: any[] = [
      { nama: 'Pembangunan', slug: 'pembangunan' },
      { nama: 'Pemerintahan', slug: 'pemerintahan' },
      { nama: 'Kesehatan', slug: 'kesehatan' },
      { nama: 'Pendidikan', slug: 'pendidikan' },
    ]

    const existingKategori = await ctx.db.query('kategori_berita').collect()
    for (const kat of SEED_KATEGORI) {
      const match = existingKategori.find((x) => x.slug === kat.slug)
      if (!match) {
        await ctx.db.insert('kategori_berita', kat)
      }
    }

    // Seed Demografi Summary
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

    // Seed Demografi Pekerjaan
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

    // Seed Demografi Usia
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

    // Seed Demografi Pendidikan
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
      {
        tingkat: 'DIPLOMA IV/STRATA I (S1)',
        jumlahLaki: 45,
        jumlahPerempuan: 47,
      },
      { tingkat: 'STRATA II (S2)', jumlahLaki: 0, jumlahPerempuan: 0 },
      { tingkat: 'STRATA III (S3)', jumlahLaki: 0, jumlahPerempuan: 0 },
    ]
    const existingPendidikan = await ctx.db
      .query('demografi_pendidikan')
      .collect()

    for (let i = 0; i < pendidikanData.length; i++) {
      const match = existingPendidikan.find(
        (p) => p.tingkat === pendidikanData[i].tingkat,
      )
      if (!match) {
        await ctx.db.insert('demografi_pendidikan', {
          ...pendidikanData[i],
          urutan: existingPendidikan.length + i + 1,
        })
      }
    }

    // Seed Demografi Agama
    const agamaData = [
      { agama: 'ISLAM', jumlahLaki: 2594, jumlahPerempuan: 2570 },
      { agama: 'KRISTEN', jumlahLaki: 6, jumlahPerempuan: 5 },
      { agama: 'KATOLIK', jumlahLaki: 0, jumlahPerempuan: 0 },
      { agama: 'HINDU', jumlahLaki: 0, jumlahPerempuan: 0 },
      { agama: 'BUDDHA', jumlahLaki: 0, jumlahPerempuan: 0 },
      { agama: 'KONGHUCU', jumlahLaki: 0, jumlahPerempuan: 0 },
    ]
    const existingAgama = await ctx.db.query('demografi_agama').collect()

    for (let i = 0; i < agamaData.length; i++) {
      const match = existingAgama.find((a) => a.agama === agamaData[i].agama)
      if (!match) {
        await ctx.db.insert('demografi_agama', {
          ...agamaData[i],
          urutan: existingAgama.length + i + 1,
        })
      }
    }

    // Seed Data Bansos
    const existingBansos = await ctx.db.query('bansos').first()
    if (!existingBansos) {
      const SEED_BANSOS: any[] = [
        {
          nama: 'Ahmad Subekti',
          nik: '3505010101850001',
          alamat: 'RT 001 / RW 001, Dusun Sambigede',
          jenisBansos: 'PKH',
        },
        {
          nama: 'Siti Rahayu',
          nik: '3505010201920002',
          alamat: 'RT 001 / RW 001, Dusun Sambigede',
          jenisBansos: 'BPNT',
        },
      ]

      for (const b of SEED_BANSOS) {
        await ctx.db.insert('bansos', b)
      }
    }

    // Seed Data Stunting
    const SEED_STUNTING: any[] = [
      {
        nama: 'Budi Kecil',
        dusun: 'Sambigede',
        usia: '24',
        bb: '10.5',
        tb: '85',
        status: 'Normal',
      },
      {
        nama: 'Ani',
        dusun: 'Paldoyong',
        usia: '36',
        bb: '11.2',
        tb: '88',
        status: 'Risiko',
      },
    ]

    for (const s of SEED_STUNTING) {
      await ctx.db.insert('stunting', s)
    }

    // Seed Data APBDes
    const SEED_APBDES: any[] = [
      {
        nama: 'Dana Desa (DD)',
        kategori: 'Pendapatan',
        nilai: 850000000,
        realisasi: 850000000,
        sumberDana: 'APBN',
      },
      {
        nama: 'Pembangunan Infrastruktur',
        kategori: 'Belanja',
        nilai: 450000000,
        realisasi: 400000000,
        sumberDana: 'DD',
      },
    ]

    for (const a of SEED_APBDES) {
      await ctx.db.insert('apbdes', a)
    }

    // Seed Profil Desa
    const existingProfil = await ctx.db.query('profil_desa').first()
    if (!existingProfil) {
      await ctx.db.insert('profil_desa', {
        visi: 'Terwujudnya Desa Sambigede Yang Mandiri, Sejahtera, Agamis, dan Berbudaya Melalui Tata Kelola Pemerintahan Yang Bersih dan Inovatif.',
        misi: [
          'Meningkatkan kualitas pelayanan publik melalui digitalisasi dan transparansi.',
          'Membangun dan memelihara infrastruktur desa yang berkualitas secara merata.',
          'Pemberdayaan ekonomi kerakyatan melalui BUMDes dan kelompok usaha tani.',
          'Meningkatkan kualitas kesehatan, pendidikan, dan kerukunan antar warga.',
        ],
        sejarah:
          'Desa Sambigede adalah desa yang kaya akan potensi alam dan budaya.',
      })
    }

    // Seed Beranda Config
    const existingBeranda = await ctx.db.query('beranda_config').first()
    if (!existingBeranda) {
      await ctx.db.insert('beranda_config', {
        heroBadge: 'Transformasi Menuju Desa Digital',
        heroTitle: 'Selamat Datang di \n Desa Sambigede',
        heroSubtitle:
          'Website Resmi Desa Sambigede. Sumber informasi terbaru tentang pemerintahan yang berorientasi pada keterbukaan informasi publik.',
        heroImageUrl:
          'https://images.unsplash.com/photo-1662083555510-1187b2aba1e2?auto=format&fit=crop&w=1920&q=80',
        kadesPeriode: 'Periode 2024 - 2029',
        kadesSambutan:
          "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi Desa Sambigede, Kecamatan Binangun, Kabupaten Blitar. Melalui portal website ini, kami berharap dapat memberikan transparansi informasi pemerintahan, mempermudah pelayanan administrasi, dan memperkenalkan seluruh potensi unggulan Desa Sambigede kepada masyarakat luas.",
      })
    }

    // Seed Kontak Config
    const existingKontak = await ctx.db.query('kontak_config').first()
    if (!existingKontak) {
      await ctx.db.insert('kontak_config', {
        alamat:
          'Jalan Raya Sambigede No. 01, Kec. Binangun, Kab. Blitar, Jawa Timur 66183',
        teleponKantor: '+62 822-5034-5977',
        teleponDarurat: '+62 811-2233-4455',
        email: 'pemdes@sambigede-blitar.desa.id',
        jamPelayanan: 'Senin - Jumat: 08.00 - 15.00 WIB\nSabtu - Minggu: Tutup',
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
      })
    }

    // Seed Kelembagaan (Sample)
    const existingKelembagaan = await ctx.db.query('kelembagaan').first()
    if (!existingKelembagaan) {
      const bpdId = await ctx.db.insert('kelembagaan', {
        nama: 'Badan Permusyawaratan Desa',
        singkatan: 'BPD',
        logoUrl: '', // Akan diupdate via admin
        deskripsi:
          'Lembaga perwujudan demokrasi dalam penyelenggaraan pemerintahan desa.',
        urutan: 1,
      })

      await ctx.db.insert('pengurus_kelembagaan', {
        kelembagaanId: bpdId,
        nama: 'CH.A.ALI WAHYUDI, S.E',
        jabatan: 'Ketua (merangkap anggota)',
        urutan: 1,
      })
    }

    // Seed Perangkat Desa
    const existingPerangkat = await ctx.db.query('perangkat_desa').first()
    if (!existingPerangkat) {
      const perangkatList = [
        { nama: 'Roihan Al Madzhar', jabatan: 'Kepala Desa' },
        { nama: 'Agus Anang Styobudi, S.Kom', jabatan: 'Sekretaris Desa' },
        { nama: 'Budi Kurniawan, S.Pd.SD', jabatan: 'Kasi Pemerintahan' },
        { nama: 'Suhadi', jabatan: 'Kasi Kesejahteraan' },
        { nama: 'Siti Nur Kolifah, S.Ak', jabatan: 'Kasi Pelayanan' },
        { nama: 'Agus Wiyono', jabatan: 'Kaur Tata Usaha & Umum' },
        { nama: 'Sunarmi', jabatan: 'Kaur Keuangan' },
        { nama: 'Bibit Hasanuddin', jabatan: 'Kaur Perencanaan' },
        { nama: 'Sundari', jabatan: 'Kamituwo Dusun Sambigede' },
        { nama: 'Pitantoro', jabatan: 'Kamituwo Dusun Paldoyong' },
        { nama: 'Imam Mahfud', jabatan: 'Karyawan Desa (Staf Kewilayahan)' },
        { nama: 'Muhyiddin', jabatan: 'Karyawan Desa (Modin Islam)' },
        { nama: 'Riadi', jabatan: 'Karyawan Desa (Kebersihan Kantor)' },
      ]

      for (let i = 0; i < perangkatList.length; i++) {
        await ctx.db.insert('perangkat_desa', {
          nama: perangkatList[i].nama,
          jabatan: perangkatList[i].jabatan,
          imageUrl: '',
          urutan: i + 1,
          status: 'Aktif',
        })
      }
    }

    // Seed Kategori Pengaduan
    const existingKategoriPengaduan = await ctx.db
      .query('kategori_pengaduan')
      .first()
    if (!existingKategoriPengaduan) {
      const SEED_KATEGORI_PENGADUAN = [
        { nama: 'Infrastruktur & Fasilitas Umum' },
        { nama: 'Layanan Kependudukan & Administrasi' },
        { nama: 'Keamanan & Ketertiban' },
        { nama: 'Sosial & Bantuan Kemasyarakatan' },
        { nama: 'Lainnya' },
      ]
      for (const kp of SEED_KATEGORI_PENGADUAN) {
        await ctx.db.insert('kategori_pengaduan', kp)
      }
    }

    return {
      success: true,
      message: 'Database seeded successfully with Profil & Kelembagaan!',
    }
  },
})
