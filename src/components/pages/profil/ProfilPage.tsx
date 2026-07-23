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
  Store,
  ExternalLink,
  Phone,
  CheckCircle2,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '../../ui/dialog'

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
  const { data: mitraList } = useQuery(
    convexQuery(api.mitra.getMitraList, {}),
  )
  const { data: bumdesList } = useQuery(
    convexQuery(api.bumdes.getBumdesList, {}),
  )
  const { data: koperasiList } = useQuery(
    convexQuery(api.koperasi.getKoperasiList, {}),
  )

  const [selectedBumdes, setSelectedBumdes] = useState<any | null>(null)
  const [selectedKoperasi, setSelectedKoperasi] = useState<any | null>(null)

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

      {/* Mitra Desa */}
      {mitraList && mitraList.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 w-full mt-16 md:mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#333] mb-2">
              Mitra Desa
            </h2>
            <p className="text-[#666] text-sm max-w-[600px] mx-auto">
              Sinergi dan kolaborasi bersama mitra kerja dalam mendukung keamanan, ketertiban, dan pelayanan di Desa Sambigede.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mitraList.map((mitra, index) => {
              const color = cardColors[index % cardColors.length]
              return (
                <div key={mitra._id} className="bg-[#F9F9F9] border border-[#E5E5E5] p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 ${color.bg} ${color.text} rounded-full flex items-center justify-center mb-4 p-2`}>
                    {mitra.logoUrl ? (
                      <R2Image
                        src={mitra.logoUrl}
                        alt={mitra.singkatan}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Handshake className="w-8 h-8" />
                    )}
                  </div>
                  <h4 className="font-bold text-[#333] mb-1 text-lg">{mitra.singkatan}</h4>
                  <p className="text-sm text-[#666] mb-4">{mitra.nama}</p>
                  
                  <div className="w-full pt-4 border-t border-[#E5E5E5]/80 mt-auto">
                    <p className="text-xs text-[#999] uppercase tracking-wider font-semibold mb-2">Penanggung Jawab</p>
                    <div className="flex flex-col gap-1">
                      {mitra.penanggungJawab.map((pj: string, i: number) => (
                        <p key={i} className="text-sm font-medium text-[#333]">{pj}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* BUMDes */}
      {bumdesList && bumdesList.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 w-full mt-16 md:mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#333] mb-2">
              BUMDes (Badan Usaha Milik Desa)
            </h2>
            <p className="text-[#666] text-sm max-w-[600px] mx-auto">
              Unit usaha desa yang dikelola secara profesional untuk meningkatkan kemandirian dan perekonomian warga Desa Sambigede.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bumdesList.map((bumdes) => (
              <div 
                key={bumdes._id} 
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer"
                onClick={() => setSelectedBumdes(bumdes)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center p-2 shrink-0">
                    {bumdes.logoUrl ? (
                      <R2Image
                        src={bumdes.logoUrl}
                        alt={bumdes.nama}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Store className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full mb-2">
                      {bumdes.kategori}
                    </span>
                    <h3 className="font-bold text-lg text-slate-800 leading-tight">
                      {bumdes.nama}
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {bumdes.deskripsi}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  {bumdes.statusHukum ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Terdaftar Kemenkumham
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">Unit Usaha Desa</div>
                  )}
                  
                  <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Detail <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dialog Modal untuk Detail BUMDes */}
          <Dialog open={!!selectedBumdes} onOpenChange={(open) => !open && setSelectedBumdes(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-2xl max-h-[90vh] flex flex-col">
              <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3">
                  {selectedBumdes?.logoUrl ? (
                    <R2Image src={selectedBumdes.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                  ) : (
                    <Store className="w-8 h-8 text-slate-400" />
                  )}
                  <div>
                    <div className="text-xl font-bold text-slate-800">{selectedBumdes?.nama}</div>
                    <div className="text-sm font-medium text-slate-500">{selectedBumdes?.kategori}</div>
                  </div>
                </DialogTitle>
                <DialogClose className="rounded-full p-2 hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </DialogClose>
              </div>
              
              {selectedBumdes && (
                <div className="overflow-y-auto p-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Kiri: Profil & Info */}
                    <div className="md:col-span-2 space-y-6">
                      {selectedBumdes.statusHukum && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 border-b pb-2">Legalitas</h4>
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">Kemenkumham RI</p>
                            <p className="text-sm font-semibold text-slate-800 break-all">{selectedBumdes.statusHukum}</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 border-b pb-2">Kontak & Lokasi</h4>
                        
                        {selectedBumdes.kontak && (
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">WhatsApp / Telepon</p>
                            <a href={`https://wa.me/${selectedBumdes.kontak.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">
                              {selectedBumdes.kontak}
                            </a>
                          </div>
                        )}

                        {selectedBumdes.lokasi && (
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">Alamat Lengkap</p>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {selectedBumdes.lokasi}
                            </p>
                            {selectedBumdes.mapsUrl && (
                              <a href={selectedBumdes.mapsUrl} target="_blank" rel="noreferrer" className="inline-block mt-1 text-sm text-blue-600 hover:underline font-medium">
                                Buka di Google Maps →
                              </a>
                            )}
                          </div>
                        )}
                        
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Tenaga Kerja</p>
                          <p className="text-sm text-slate-700 font-medium">
                            {selectedBumdes.jumlahTenagaKerja} Orang
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Kanan: Deskripsi, Galeri, Struktur */}
                    <div className="md:col-span-3 space-y-8">
                      <div>
                        <h4 className="font-bold text-slate-800 border-b pb-2 mb-3">Tentang Unit Usaha</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedBumdes.deskripsi}
                        </p>
                      </div>

                      {selectedBumdes.fotoProduk && selectedBumdes.fotoProduk.length > 0 && (
                        <div>
                          <h4 className="font-bold text-slate-800 border-b pb-2 mb-4">Galeri & Produk</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedBumdes.fotoProduk.map((foto: string, idx: number) => (
                              <div key={idx} className="rounded-xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                                <R2Image src={foto} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-slate-800 border-b pb-2 mb-4">Susunan Pengurus</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedBumdes.struktur.map((item: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{item.jabatan}</p>
                              <p className="text-sm font-medium text-slate-800">{item.nama}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Koperasi Desa */}
      {koperasiList && koperasiList.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 w-full mt-16 md:mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#333] mb-2">
              Koperasi Desa
            </h2>
            <p className="text-[#666] text-sm max-w-[600px] mx-auto">
              Wadah ekonomi kerakyatan berasaskan kekeluargaan untuk kesejahteraan anggota dan masyarakat Desa Sambigede.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {koperasiList.map((koperasi) => (
              <div 
                key={koperasi._id} 
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer"
                onClick={() => setSelectedKoperasi(koperasi)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center p-2 shrink-0">
                    {koperasi.logoUrl ? (
                      <R2Image
                        src={koperasi.logoUrl}
                        alt={koperasi.nama}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Store className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full mb-2">
                      {koperasi.jenis}
                    </span>
                    <h3 className="font-bold text-lg text-slate-800 leading-tight">
                      {koperasi.nama}
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {koperasi.deskripsi}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  {koperasi.statusHukum ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Terdaftar Resmi
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">Koperasi Desa</div>
                  )}
                  
                  <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Detail <ExternalLink className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dialog Modal untuk Detail Koperasi */}
          <Dialog open={!!selectedKoperasi} onOpenChange={(open) => !open && setSelectedKoperasi(null)}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-2xl max-h-[90vh] flex flex-col">
              <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3">
                  {selectedKoperasi?.logoUrl ? (
                    <R2Image src={selectedKoperasi.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                  ) : (
                    <Store className="w-8 h-8 text-slate-400" />
                  )}
                  <div>
                    <div className="text-xl font-bold text-slate-800">{selectedKoperasi?.nama}</div>
                    <div className="text-sm font-medium text-slate-500">{selectedKoperasi?.jenis}</div>
                  </div>
                </DialogTitle>
                <DialogClose className="rounded-full p-2 hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </DialogClose>
              </div>
              
              {selectedKoperasi && (
                <div className="overflow-y-auto p-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Kiri: Profil & Info */}
                    <div className="md:col-span-2 space-y-6">
                      {selectedKoperasi.statusHukum && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 border-b pb-2">Legalitas</h4>
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">Badan Hukum Koperasi</p>
                            <p className="text-sm font-semibold text-slate-800 break-all">{selectedKoperasi.statusHukum}</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 border-b pb-2">Kontak & Lokasi</h4>
                        
                        {selectedKoperasi.kontak && (
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">WhatsApp / Telepon</p>
                            <a href={`https://wa.me/${selectedKoperasi.kontak.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-800 hover:text-blue-600 transition-colors">
                              {selectedKoperasi.kontak}
                            </a>
                          </div>
                        )}

                        {selectedKoperasi.lokasi && (
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">Alamat Lengkap</p>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {selectedKoperasi.lokasi}
                            </p>
                            {selectedKoperasi.mapsUrl && (
                              <a href={selectedKoperasi.mapsUrl} target="_blank" rel="noreferrer" className="inline-block mt-1 text-sm text-blue-600 hover:underline font-medium">
                                Buka di Google Maps →
                              </a>
                            )}
                          </div>
                        )}
                        
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">Anggota Aktif</p>
                          <p className="text-sm text-slate-700 font-medium">
                            {selectedKoperasi.jumlahAnggota} Anggota
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Kanan: Deskripsi, Galeri, Struktur */}
                    <div className="md:col-span-3 space-y-8">
                      <div>
                        <h4 className="font-bold text-slate-800 border-b pb-2 mb-3">Tentang Koperasi</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedKoperasi.deskripsi}
                        </p>
                      </div>

                      {selectedKoperasi.fotoKegiatan && selectedKoperasi.fotoKegiatan.length > 0 && (
                        <div>
                          <h4 className="font-bold text-slate-800 border-b pb-2 mb-4">Galeri Kegiatan</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedKoperasi.fotoKegiatan.map((foto: string, idx: number) => (
                              <div key={idx} className="rounded-xl overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                                <R2Image src={foto} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-slate-800 border-b pb-2 mb-4">Susunan Pengurus</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedKoperasi.struktur.map((item: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{item.jabatan}</p>
                              <p className="text-sm font-medium text-slate-800">{item.nama}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

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
