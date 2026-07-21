import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../../convex/_generated/api'
import {
  Building2,
  Map,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  Handshake,
  Users2,
  UsersRound,
  ShieldAlert,
  Activity,
} from 'lucide-react'

import { LembagaCard } from './ProfilLembaga'
import R2Image from '../../ui/R2Image'

const LembagaIcon = ({ url, name }: { url?: string; name: string }) => {
  const [error, setError] = useState(false)
  if (!url || error) return <Handshake className="w-7 h-7" />
  return (
    <R2Image
      src={url}
      alt={name}
      className="w-7 h-7 object-contain"
      onError={() => setError(true)}
    />
  )
}

export default function ProfilPage() {
  const [showAllPerangkat, setShowAllPerangkat] = useState(false)
  const [showAllRtRw, setShowAllRtRw] = useState(false)

  const { data: profilData } = useQuery(convexQuery(api.profil.getProfil, {}))
  const { data: kelembagaanList } = useQuery(
    convexQuery(api.kelembagaan.getKelembagaanWithAnggota, {}),
  )
  const { data: perangkatData } = useQuery(
    convexQuery(api.perangkat.getPerangkatList, { status: 'Aktif' }),
  )
  const { data: rtRwData } = useQuery(
    convexQuery(api.rt_rw.getRtRwList, { status: 'Aktif' }),
  )

  // Fallback Visi Misi
  const visi =
    profilData?.visi ||
    'Terwujudnya Desa Sambigede Yang Mandiri, Sejahtera, Agamis, dan Berbudaya Melalui Tata Kelola Pemerintahan Yang Bersih dan Inovatif.'
  const misi =
    profilData?.misi && profilData.misi.length > 0
      ? profilData.misi
      : [
          'Meningkatkan kualitas pelayanan publik melalui digitalisasi dan transparansi.',
          'Membangun dan memelihara infrastruktur desa yang berkualitas secara merata.',
          'Pemberdayaan ekonomi kerakyatan melalui BUMDes dan kelompok usaha tani.',
          'Meningkatkan kualitas kesehatan, pendidikan, dan kerukunan antar warga.',
        ]

  // Fallback map image path for village structural diagram
  const imgBagan =
    profilData?.baganStrukturUrl ||
    '/images/SUSUNAN_ORGANISASI___tATA_KERJA_PEMERINTAH_DESA_SAMBIGEDE_KECAMATAN_BINANGUN_KABUPATEN_BLITAR.png'

  const pList = perangkatData || []
  const rtRwList = rtRwData || []

  const cardColors = [
    { bg: 'bg-blue-50', text: 'text-blue-500' },
    { bg: 'bg-orange-50', text: 'text-orange-500' },
    { bg: 'bg-pink-50', text: 'text-pink-500' },
    { bg: 'bg-purple-50', text: 'text-purple-500' },
    { bg: 'bg-green-50', text: 'text-green-600' },
    { bg: 'bg-red-50', text: 'text-red-500' },
  ]

  return (
    <div className="flex flex-col w-full bg-[#F5F5F5] min-h-screen pb-20">
      {/* Profil Desa Header */}
      <div className="bg-white py-12 md:py-16 border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3F7D4A]/10 text-[#3F7D4A] px-3 py-1.5 rounded-full mb-4">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide">
                  PROFIL DESA
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#333] mb-4 leading-tight">
                Mengenal Lebih Dekat
                <br />
                Desa Sambigede
              </h1>
              <p className="text-[#666] max-w-[600px] text-sm md:text-base leading-relaxed">
                Sambigede adalah sebuah desa yang terletak di Kecamatan
                Binangun, Kabupaten Blitar. Desa ini memiliki potensi agraris
                dan sumber daya manusia yang terus berkembang menuju
                kemandirian.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="p-4 border border-[#E5E5E5] rounded-xl bg-[#F9F9F9] col-span-2">
                <p className="text-xs text-[#666] mb-1">Luas Wilayah</p>
                <p className="font-semibold text-[#333]">710.125 Hektar</p>
              </div>
              <div className="p-4 border border-[#E5E5E5] rounded-xl bg-[#F9F9F9] col-span-2">
                <p className="text-xs text-[#666] mb-2">Batas Wilayah</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#333]">
                  <div className="flex">
                    <span className="w-20 font-medium">Utara</span>: Ngadri dan
                    Umbuldamar
                  </div>
                  <div className="flex">
                    <span className="w-20 font-medium">Selatan</span>: Birowo
                    dan Binangun
                  </div>
                  <div className="flex">
                    <span className="w-20 font-medium">Barat</span>: Rejoso
                  </div>
                  <div className="flex">
                    <span className="w-20 font-medium">Timur</span>: Birowo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="max-w-[1200px] mx-auto px-6 w-full mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#333] mb-4">Visi</h2>
            <p className="text-[#666] text-lg font-medium leading-relaxed italic">
              "{visi}"
            </p>
          </div>

          <div className="bg-[#3F7D4A] rounded-2xl p-8 shadow-md text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Map className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Misi</h2>
            <ul className="space-y-4">
              {misi.map((m, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-bold text-white/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-white/90 text-sm">{m}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Kelembagaan Desa (Modular Components) */}
      <div className="max-w-[1200px] mx-auto px-6 w-full mt-16 md:mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#333] mb-2">
            Kelembagaan Desa
          </h2>
          <p className="text-[#666] text-sm max-w-[600px] mx-auto">
            Organisasi dan lembaga kemasyarakatan yang berperan aktif dalam
            memajukan kesejahteraan dan pembangunan di Desa Sambigede.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {kelembagaanList && kelembagaanList.length > 0 ? (
            kelembagaanList.map((lembaga, index) => {
              const color = cardColors[index % cardColors.length]
              return (
                <LembagaCard
                  key={lembaga._id}
                  icon={
                    <LembagaIcon
                      url={lembaga.logoUrl}
                      name={lembaga.singkatan}
                    />
                  }
                  colorBg={color.bg}
                  colorText={color.text}
                  title={lembaga.singkatan}
                  subtitle={lembaga.nama}
                  anggota={lembaga.pengurus.map((p) => ({
                    nama: p.nama,
                    jabatan: p.jabatan,
                  }))}
                />
              )
            })
          ) : (
            <div className="col-span-full py-10 text-center text-[#666]">
              Belum ada data kelembagaan yang ditambahkan.
            </div>
          )}
        </div>
      </div>

      {/* SOTK / Perangkat Desa */}
      <div className="max-w-[1200px] mx-auto px-6 w-full mt-16 md:mt-20">
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-10 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#333]">
                Susunan Organisasi Pemerintahan
              </h2>
              <p className="text-sm text-[#666]">
                Struktur Organisasi dan Tata Kerja (SOTK) Pemerintah Desa
                Sambigede
              </p>
            </div>
          </div>

          <div className="w-full bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl p-4 mb-10 overflow-x-auto">
            <div className="min-w-[800px]">
              <R2Image
                src={imgBagan}
                alt="Bagan SOTK Desa Sambigede"
                fallbackSrc="/images/SUSUNAN_ORGANISASI___tATA_KERJA_PEMERINTAH_DESA_SAMBIGEDE_KECAMATAN_BINANGUN_KABUPATEN_BLITAR.png"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#333] mb-4">
              Daftar Perangkat & Karyawan Desa
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-t border-[#E5E5E5]">
                <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">
                      No
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">
                      Nama Lengkap
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">
                      Jabatan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {(showAllPerangkat ? pList : pList.slice(0, 5)).map(
                    (p: any, index: number) => (
                      <tr
                        key={p._id || p.no}
                        className="hover:bg-[#F5F5F5] transition-colors"
                      >
                        <td className="px-5 py-3 text-[#999] text-xs w-16">
                          {index + 1}
                        </td>
                        <td className="px-5 py-3 font-medium text-[#333]">
                          <div className="flex items-center gap-3">
                            {p.imageUrl ? (
                              <R2Image
                                src={p.imageUrl}
                                alt={p.nama}
                                className="w-8 h-8 rounded-full object-cover object-top border border-slate-200"
                              />
                            ) : null}
                            {p.nama}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[#666]">{p.jabatan}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {pList.length > 5 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowAllPerangkat(!showAllPerangkat)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#3F7D4A] hover:text-[#1F3D2B] transition-colors bg-[#3F7D4A]/10 hover:bg-[#3F7D4A]/20 px-4 py-2 rounded-full"
                >
                  {showAllPerangkat ? (
                    <>
                      <ChevronUp className="w-4 h-4" /> Tampilkan Lebih Sedikit
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> Tampilkan Semua
                      Perangkat ({pList.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Daftar Ketua RT & RW */}
      <div className="max-w-[1200px] mx-auto px-6 w-full mt-16 md:mt-20">
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-10 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#333]">
                Daftar Ketua RT & RW
              </h2>
              <p className="text-sm text-[#666]">
                Struktur kepengurusan Rukun Tetangga dan Rukun Warga Desa Sambigede
              </p>
            </div>
          </div>

          <div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="border-y border-[#E5E5E5] bg-[#F9F9F9]">
                    <th className="px-5 py-4 font-semibold text-[#333] text-sm w-16">
                      No
                    </th>
                    <th className="px-5 py-4 font-semibold text-[#333] text-sm">
                      Nama Lengkap
                    </th>
                    <th className="px-5 py-4 font-semibold text-[#333] text-sm">
                      Jabatan
                    </th>
                    <th className="px-5 py-4 font-semibold text-[#333] text-sm">
                      RT / RW
                    </th>
                    <th className="px-5 py-4 font-semibold text-[#333] text-sm">
                      Dusun
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {rtRwList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-[#666]">
                        Belum ada data ketua RT dan RW
                      </td>
                    </tr>
                  ) : (
                    (showAllRtRw ? rtRwList : rtRwList.slice(0, 5)).map(
                      (p: any, index: number) => (
                        <tr
                          key={p._id || index}
                          className="hover:bg-[#F5F5F5] transition-colors"
                        >
                          <td className="px-5 py-3 text-[#999] text-xs w-16">
                            {index + 1}
                          </td>
                          <td className="px-5 py-3 font-medium text-[#333]">
                            {p.nama}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                p.jabatan === 'Ketua RW'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {p.jabatan}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-semibold text-[#555]">
                            {p.rtRw}
                          </td>
                          <td className="px-5 py-3 text-[#666]">
                            {p.dusun}
                          </td>
                        </tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>

            {rtRwList.length > 5 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowAllRtRw(!showAllRtRw)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#3F7D4A] hover:text-[#1F3D2B] transition-colors bg-[#3F7D4A]/10 hover:bg-[#3F7D4A]/20 px-4 py-2 rounded-full"
                >
                  {showAllRtRw ? (
                    <>
                      <ChevronUp className="w-4 h-4" /> Tampilkan Lebih Sedikit
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" /> Tampilkan Semua
                      RT/RW ({rtRwList.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
