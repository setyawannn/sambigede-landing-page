import { useState } from 'react'
import {
  Building2,
  Info,
  Package,
  Search,
  Phone,
  Facebook,
  Star,
  ChevronDown,
  ChevronUp,
  Grid,
  Newspaper,
  User,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import R2Image from '../../ui/R2Image'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../../convex/_generated/api'

const findImageFor = (personName: string) => {
  const base = personName
    .split(',')[0]
    .replace(/\./g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
  return `/images/${base}.jpg`
}

export default function HomePage() {
  const [showAllPerangkat, setShowAllPerangkat] = useState(false)

  // Fetch data
  const { data: berandaData } = useQuery(
    convexQuery(api.beranda.getBerandaConfig, {}),
  )
  const { data: perangkatData } = useQuery(
    convexQuery(api.perangkat.getPerangkatList, { status: 'Aktif' }),
  )
  const { data: beritaData } = useQuery(convexQuery(api.berita.getBerita, {}))
  const { data: demografiData } = useQuery(
    convexQuery(api.demografi.getSummary, {}),
  )

  const recentBerita = beritaData?.slice(0, 3) || []
  
  const visiblePerangkatList = showAllPerangkat
    ? perangkatData || []
    : (perangkatData || []).slice(0, 4)

  const kades = perangkatData?.find(
    (p) => p.jabatan.toLowerCase() === 'kepala desa',
  )
  const kadesNama = kades?.nama || 'Kepala Desa'

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-700"
          style={{
            backgroundImage: `url('${berandaData?.heroImageUrl || '/public/images/hero-fallback.webp'}')`,
          }}
        ></div>
        {/* Backdrop hitam agar teks kontras dan mudah dibaca */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full flex flex-col gap-6">
          {berandaData?.heroBadge && (
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-white/20">
              <span className="text-white text-xs md:text-sm font-medium">
                {berandaData.heroBadge}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl leading-tight">
              {berandaData?.heroTitle ? (
                berandaData.heroTitle.split('\n').map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i !== arr.length - 1 && <br />}
                  </span>
                ))
              ) : (
                <>
                  Selamat Datang di
                  <br />
                  Desa Sambigede
                </>
              )}
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-[600px] leading-relaxed drop-shadow-md mt-4">
              {berandaData?.heroSubtitle ||
                'Website Resmi Desa Sambigede. Sumber informasi terbaru tentang pemerintahan yang berorientasi pada keterbukaan informasi publik.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <a
              href="#layanan"
              className="bg-[#3F7D4A] hover:bg-[#1F3D2B] text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors shadow-lg"
            >
              Akses Layanan
            </a>
            <Link
              to="/kontak"
              className="bg-transparent border border-white hover:bg-white hover:text-[#3F7D4A] text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors shadow-lg flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Layanan Pengaduan
            </Link>
          </div>
        </div>
      </section>

      {/* Layanan & Informasi */}
      <section
        id="layanan"
        className="py-16 md:py-20 px-6 max-w-[1200px] mx-auto w-full"
      >
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <h2 className="text-2xl font-bold text-[#3F7D4A]">
            Layanan & Informasi
          </h2>
          <p className="text-[#666] text-sm max-w-[600px]">
            Situs resmi desa kami untuk memberikan informasi dan layanan publik
            secara digital dan transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/profil"
            className="group bg-white border border-[#E5E5E5] rounded-xl p-8 flex flex-col items-center text-center hover:border-[#3F7D4A] hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-yellow-50 text-yellow-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-[#333] mb-2">Informasi Desa</h3>
            <p className="text-xs text-[#666] line-clamp-2">
              Lihat profil lengkap dan sejarah desa.
            </p>
          </Link>

          <Link
            to="/infografis"
            className="group bg-white border border-[#E5E5E5] rounded-xl p-8 flex flex-col items-center text-center hover:border-[#3F7D4A] hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-[#333] mb-2">Data Penduduk</h3>
            <p className="text-xs text-[#666] line-clamp-2">
              Validasi & statistik kependudukan.
            </p>
          </Link>

          <Link
            to="/infografis"
            className="group bg-white border border-[#E5E5E5] rounded-xl p-8 flex flex-col items-center text-center hover:border-[#3F7D4A] hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-[#333] mb-2">Cek Bansos</h3>
            <p className="text-xs text-[#666] line-clamp-2">
              Periksa status penerima bantuan sosial.
            </p>
          </Link>

          <Link
            to="/kontak"
            className="group bg-white border border-[#E5E5E5] rounded-xl p-8 flex flex-col items-center text-center hover:border-[#3F7D4A] hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-[#333] mb-2">Hubungi Kami</h3>
            <p className="text-xs text-[#666] line-clamp-2">
              Layanan pengaduan dan kontak desa.
            </p>
          </Link>
        </div>
      </section>

      {/* Sambutan Kepala Desa */}
      <section className="bg-[#F5F5F5] py-16 md:py-20 px-6">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full max-w-[400px] mx-auto lg:mx-0">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-slate-100 flex items-center justify-center">
                {kades?.imageUrl ? (
                  <R2Image
                    src={kades.imageUrl}
                    alt={`Kepala Desa Sambigede - ${kadesNama}`}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <User className="w-32 h-32 text-slate-300" />
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#3F7D4A] rounded-2xl -z-10 opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-[#3F7D4A] rounded-2xl -z-10 opacity-20"></div>
            </div>
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <h2 className="text-[20px] font-bold text-[#3F7D4A]">
                Sambutan Kepala Desa Sambigede
              </h2>
              <div className="w-10 h-[3px] bg-[#3F7D4A] mx-auto lg:mx-0 mt-1 mb-2"></div>
              <div>
                <h3 className="text-lg font-bold text-[#333]">{kadesNama}</h3>
                <p className="text-sm text-[#666]">
                  {berandaData?.kadesPeriode || 'Periode 2024 - 2029'}
                </p>
              </div>
              <div className="text-[#666] text-sm leading-relaxed max-w-[600px] mx-auto lg:mx-0 italic whitespace-pre-line">
                "
                {berandaData?.kadesSambutan ||
                  "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi Desa Sambigede, Kecamatan Binangun, Kabupaten Blitar. Melalui portal website ini, kami berharap dapat memberikan transparansi informasi pemerintahan, mempermudah pelayanan administrasi, dan memperkenalkan seluruh potensi unggulan Desa Sambigede kepada masyarakat luas."}
                "
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Administrasi Penduduk (Snippet) */}
      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-[#3F7D4A] mb-3">
                Administrasi Penduduk
              </h2>
              <p className="text-[#666] text-sm">
                Data statistik kependudukan Desa Sambigede terkini.
              </p>
            </div>
            <Link
              to="/infografis"
              className="inline-flex items-center justify-center px-4 py-2 border border-[#3F7D4A] text-[#3F7D4A] hover:bg-[#3F7D4A] hover:text-white rounded-lg text-sm font-medium transition-colors"
            >
              Lihat Detail
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                label: 'Total Penduduk',
                count: demografiData?.totalPenduduk || '0',
                icon: <Search />,
                color: 'text-yellow-600 bg-yellow-100',
              },
              {
                label: 'Laki-Laki',
                count: demografiData?.jumlahLaki || '0',
                icon: <Search />,
                color: 'text-blue-600 bg-blue-100',
              },
              {
                label: 'Perempuan',
                count: demografiData?.jumlahPerempuan || '0',
                icon: <Search />,
                color: 'text-pink-600 bg-pink-100',
              },
              {
                label: 'Kepala Keluarga',
                count: demografiData?.jumlahKK || '0',
                icon: <Search />,
                color: 'text-purple-600 bg-purple-100',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-transparent hover:border-[#3F7D4A]/30 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                  <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#333]">{stat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="bg-[#F5F5F5] py-16 md:py-20 px-6">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-[#3F7D4A] mb-3">
                Struktur Organisasi
              </h2>
              <p className="text-[#666] text-sm">
                Susunan kepengurusan perangkat Desa Sambigede.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {visiblePerangkatList.map((person, i) => (
              <div
                key={person._id || i}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="aspect-square overflow-hidden bg-slate-100 relative flex items-center justify-center">
                  {person.imageUrl ? (
                    <R2Image
                      src={person.imageUrl}
                      alt={person.nama}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      fallbackSrc="/images/placeholder.jpg"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300 group-hover:scale-105 transition-transform duration-300">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <div className="bg-[#3F7D4A] p-3 text-center h-full">
                  <h4 className="text-white text-sm font-bold uppercase line-clamp-1">
                    {person.nama}
                  </h4>
                  <p className="text-white/90 text-xs line-clamp-1">{person.jabatan}</p>
                </div>
              </div>
            ))}
          </div>

          {(perangkatData?.length || 0) > 4 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAllPerangkat(!showAllPerangkat)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#3F7D4A] text-[#3F7D4A] hover:bg-[#3F7D4A] hover:text-white rounded-lg text-sm font-medium transition-colors"
              >
                {showAllPerangkat ? (
                  <>Tampilkan Lebih Sedikit <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Lihat Selengkapnya <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Berita & Pengumuman Terbaru */}
      <section className="bg-white py-16 md:py-20 px-6">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="text-center flex flex-col items-center gap-3 mb-10">
            <h2 className="text-2xl font-bold text-[#3F7D4A]">
              Berita & Pengumuman Terbaru
            </h2>
            <p className="text-[#666] text-sm max-w-[600px]">
              Informasi dan kabar terbaru seputar kegiatan di Desa Sambigede.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBerita.map((news) => {
              const date = new Date(news._creationTime).toLocaleDateString(
                'id-ID',
                {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                },
              )

              return (
                <Link
                  to="/berita/$slug"
                  params={{ slug: news.slug }}
                  key={news._id}
                  className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <R2Image
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackSrc="/images/placeholder.jpg"
                    />
                    <div className="absolute top-4 left-4 bg-[#3F7D4A] text-white text-xs font-medium px-3 py-1 rounded-full">
                      {news.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-[#333] mb-2 line-clamp-2 group-hover:text-[#3F7D4A] transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-[#666] mb-4 line-clamp-2">
                      {news.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-[#E5E5E5] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#3F7D4A] flex items-center justify-center text-white text-xs font-bold">
                        {news.author.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#666]">
                        <span className="font-medium text-[#333]">
                          {news.author}
                        </span>
                        <span>•</span>
                        <span>{date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/berita"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#3F7D4A] text-[#3F7D4A] hover:bg-[#3F7D4A] hover:text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Newspaper className="w-4 h-4" />
              Baca Selengkapnya
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
