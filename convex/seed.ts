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
        nama: 'BILQIS AZZARA NUR ATTA',
        nik: undefined,
        tanggalLahir: 1646265600000,
        jk: 'P',
        namaOrtu: 'ITA SULIATI',
        alamat: 'SAMBIGEDE',
        pos: 'MATAHARI 1',
        bulan: 5,
        tahun: 2026,
      },
      {
        nama: 'RIZAL SHEHAN FATAHILAH',
        nik: '3505160907230001',
        tanggalLahir: 1688860800000,
        jk: 'L',
        namaOrtu: 'ANIS SRIANAH',
        alamat: 'PALDOYONG 1/2',
        pos: 'MATAHARI 2',
        bulan: 5,
        tahun: 2026,
      },
      {
        nama: 'NADIRA MECCA ALMAHYRA',
        nik: '3505166606230001',
        tanggalLahir: 1687737600000,
        jk: 'P',
        namaOrtu: 'RAHAYU WULANDARI',
        alamat: 'PALDOYONG 4/1',
        pos: 'MATAHARI 3',
        bulan: 5,
        tahun: 2026,
      },
      {
        nama: 'AZZURA SYAKILA',
        nik: '3505166504230005',
        tanggalLahir: 1682380800000,
        jk: 'P',
        namaOrtu: 'NOPITA RAHMAWATI',
        alamat: 'PALDOYONG 1/1',
        pos: 'MATAHARI 3',
        bulan: 5,
        tahun: 2026,
      },
      {
        nama: 'CELINE DHATU KHASANAH',
        nik: undefined,
        tanggalLahir: 1709424000000,
        jk: 'P',
        namaOrtu: 'LISA',
        alamat: 'SAMBIGEDE',
        pos: 'MATAHARI 5',
        bulan: 5,
        tahun: 2026,
      },
      {
        nama: 'MUHAMMAD AZZAM GHIFARI',
        nik: undefined,
        tanggalLahir: 1666569600000,
        jk: 'L',
        namaOrtu: 'ENI',
        alamat: 'SAMBIGEDE',
        pos: 'MATAHARI 6',
        bulan: 5,
        tahun: 2026,
      },
      {
        nama: 'ELSA SALSABILA',
        nik: undefined,
        tanggalLahir: 1721088000000,
        jk: 'P',
        namaOrtu: 'PUPUT HANDAYANI',
        alamat: 'SAMBIGEDE',
        pos: 'MATAHARI 7',
        bulan: 5,
        tahun: 2026,
      },
    ]

    for (const s of SEED_STUNTING) {
      await ctx.db.insert('stunting', s)
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
          '/public/images/hero-fallback.webp',
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

    // Seed RT / RW
    const SEED_RTRW: any[] = [
      { urutan: 1, nama: 'HARIYANTO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RW', rtRw: 'RW 001', status: 'Aktif' },
      { urutan: 2, nama: 'MURKAERI', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 001 / RW 001', status: 'Aktif' },
      { urutan: 3, nama: 'WAN DANUSI', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 002 / RW 001', status: 'Aktif' },
      { urutan: 4, nama: 'GANDUNG', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 003 / RW 001', status: 'Aktif' },
      { urutan: 5, nama: 'SUMADJI', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 004 / RW 001', status: 'Aktif' },
      { urutan: 6, nama: 'MARODIN', dusun: 'SAMBIGEDE', jabatan: 'Ketua RW', rtRw: 'RW 002', status: 'Aktif' },
      { urutan: 7, nama: 'LAMIRIN', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 001 / RW 002', status: 'Aktif' },
      { urutan: 8, nama: 'JOKO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 002 / RW 002', status: 'Aktif' },
      { urutan: 9, nama: 'RIDAWANTO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 003 / RW 002', status: 'Aktif' },
      { urutan: 10, nama: 'SUPRIANTO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 004 / RW 002', status: 'Aktif' },
      { urutan: 11, nama: 'SUTARI', dusun: 'SAMBIGEDE', jabatan: 'Ketua RW', rtRw: 'RW 003', status: 'Aktif' },
      { urutan: 12, nama: 'SUGENG SANTOSO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 001 / RW 003', status: 'Aktif' },
      { urutan: 13, nama: 'BASUKI', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 002 / RW 003', status: 'Aktif' },
      { urutan: 14, nama: 'GITO ROLIS', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 003 / RW 003', status: 'Aktif' },
      { urutan: 15, nama: 'TUKIJO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 004 / RW 003', status: 'Aktif' },
      { urutan: 16, nama: 'SUHARI', dusun: 'SAMBIGEDE', jabatan: 'Ketua RW', rtRw: 'RW 004', status: 'Aktif' },
      { urutan: 17, nama: 'WALUYO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 001 / RW 004', status: 'Aktif' },
      { urutan: 18, nama: 'KUSNU AMAR', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 002 / RW 004', status: 'Aktif' },
      { urutan: 19, nama: 'DEDI IRAWAN', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 003 / RW 004', status: 'Aktif' },
      { urutan: 20, nama: 'SUJI', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 004 / RW 004', status: 'Aktif' },
      { urutan: 21, nama: 'SUBUR SUTRISNO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RW', rtRw: 'RW 005', status: 'Aktif' },
      { urutan: 22, nama: 'HERMANTO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 001 / RW 005', status: 'Aktif' },
      { urutan: 23, nama: 'HENDRA', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 002 / RW 005', status: 'Aktif' },
      { urutan: 24, nama: 'MUJIANTO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 003 / RW 005', status: 'Aktif' },
      { urutan: 25, nama: 'HERU SANTOSO', dusun: 'SAMBIGEDE', jabatan: 'Ketua RT', rtRw: 'RT 004 / RW 005', status: 'Aktif' },
      { urutan: 26, nama: 'HARIADI', dusun: 'PALDOYONG', jabatan: 'Ketua RW', rtRw: 'RW 001', status: 'Aktif' },
      { urutan: 27, nama: 'SUTIK', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 001 / RW 001', status: 'Aktif' },
      { urutan: 28, nama: 'KATENO', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 002 / RW 001', status: 'Aktif' },
      { urutan: 29, nama: 'AHMAD SANTOSO', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 003 / RW 001', status: 'Aktif' },
      { urutan: 30, nama: 'MOHAMMAD HASAN', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 004 / RW 001', status: 'Aktif' },
      { urutan: 31, nama: 'GIMIN', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 005 / RW 001', status: 'Aktif' },
      { urutan: 32, nama: 'MISTAJI', dusun: 'PALDOYONG', jabatan: 'Ketua RW', rtRw: 'RW 002', status: 'Aktif' },
      { urutan: 33, nama: 'GUNAWAN', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 001 / RW 002', status: 'Aktif' },
      { urutan: 34, nama: 'KARIM', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 002 / RW 002', status: 'Aktif' },
      { urutan: 35, nama: 'WAGITO', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 003 / RW 002', status: 'Aktif' },
      { urutan: 36, nama: 'SUWAKIN', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 004 / RW 002', status: 'Aktif' },
      { urutan: 37, nama: 'SUNARI', dusun: 'PALDOYONG', jabatan: 'Ketua RT', rtRw: 'RT 005 / RW 002', status: 'Aktif' },
    ]

    const existingRtRw = await ctx.db.query('rt_rw').collect()
    if (existingRtRw.length === 0) {
      for (const item of SEED_RTRW) {
        await ctx.db.insert('rt_rw', item)
      }
    }

    return {
      success: true,
      message: 'Database seeded successfully with Profil & Kelembagaan!',
    }
  },
})
