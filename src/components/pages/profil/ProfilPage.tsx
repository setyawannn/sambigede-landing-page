import { useState } from "react";
import {
  Building2, Map, Users, Target, ChevronDown, ChevronUp,
  Handshake, Users2, UsersRound, ShieldAlert, Activity
} from "lucide-react";

import { LembagaCard } from "./ProfilLembaga";
import {
  bpdAnggota, lpmdAnggota, pkkAnggota,
  ktAnggota, satlinmasAnggota, posyanduAnggota, perangkatList
} from "./ProfilData";

export default function ProfilPage() {
  const [showAllPerangkat, setShowAllPerangkat] = useState(false);
  const [showAllRtRw, setShowAllRtRw] = useState(false);

  // Fallback map image path for village structural diagram
  const imgBagan = "/images/SUSUNAN_ORGANISASI___tATA_KERJA_PEMERINTAH_DESA_SAMBIGEDE_KECAMATAN_BINANGUN_KABUPATEN_BLITAR.png";

  return (
    <div className="flex flex-col w-full bg-[#F5F5F5] min-h-screen pb-20">
      {/* Profil Desa Header */}
      <div className="bg-white py-12 md:py-16 border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#6B8E23]/10 text-[#6B8E23] px-3 py-1.5 rounded-full mb-4">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide">PROFIL DESA</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#333] mb-4 leading-tight">
                Mengenal Lebih Dekat<br/>Desa Sambigede
              </h1>
              <p className="text-[#666] max-w-[600px] text-sm md:text-base leading-relaxed">
                Sambigede adalah sebuah desa yang terletak di Kecamatan Binangun, Kabupaten Blitar. Desa ini memiliki potensi agraris dan sumber daya manusia yang terus berkembang menuju kemandirian.
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
                  <div className="flex"><span className="w-20 font-medium">Utara</span>: Ngadri dan Umbuldamar</div>
                  <div className="flex"><span className="w-20 font-medium">Selatan</span>: Birowo dan Binangun</div>
                  <div className="flex"><span className="w-20 font-medium">Barat</span>: Rejoso</div>
                  <div className="flex"><span className="w-20 font-medium">Timur</span>: Birowo</div>
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
              "Terwujudnya Desa Sambigede Yang Mandiri, Sejahtera, Agamis, dan Berbudaya Melalui Tata Kelola Pemerintahan Yang Bersih dan Inovatif."
            </p>
          </div>
          
          <div className="bg-[#6B8E23] rounded-2xl p-8 shadow-md text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <Map className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Misi</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="font-bold text-white/50">01</span>
                <p className="text-white/90 text-sm">Meningkatkan kualitas pelayanan publik melalui digitalisasi dan transparansi.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-white/50">02</span>
                <p className="text-white/90 text-sm">Membangun dan memelihara infrastruktur desa yang berkualitas secara merata.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-white/50">03</span>
                <p className="text-white/90 text-sm">Pemberdayaan ekonomi kerakyatan melalui BUMDes dan kelompok usaha tani.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-white/50">04</span>
                <p className="text-white/90 text-sm">Meningkatkan kualitas kesehatan, pendidikan, dan kerukunan antar warga.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Kelembagaan Desa (Modular Components) */}
      <div className="max-w-[1200px] mx-auto px-6 w-full mt-16 md:mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#333] mb-2">Kelembagaan Desa</h2>
          <p className="text-[#666] text-sm max-w-[600px] mx-auto">
            Organisasi dan lembaga kemasyarakatan yang berperan aktif dalam memajukan kesejahteraan dan pembangunan di Desa Sambigede.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <LembagaCard
            icon={<Handshake className="w-7 h-7" />}
            colorBg="bg-blue-50" colorText="text-blue-500"
            title="BPD" subtitle="Badan Permusyawaratan Desa"
            anggota={bpdAnggota}
          />
          <LembagaCard
            icon={<Building2 className="w-7 h-7" />}
            colorBg="bg-orange-50" colorText="text-orange-500"
            title="LPMD" subtitle="Lembaga Pemberdayaan Masyarakat Desa"
            anggota={lpmdAnggota}
          />
          <LembagaCard
            icon={<Users2 className="w-7 h-7" />}
            colorBg="bg-pink-50" colorText="text-pink-500"
            title="TP PKK" subtitle="Tim Penggerak Pemberdayaan Kesejahteraan Keluarga"
            anggota={pkkAnggota}
          />
          <LembagaCard
            icon={<UsersRound className="w-7 h-7" />}
            colorBg="bg-purple-50" colorText="text-purple-500"
            title="Karang Taruna" subtitle="Organisasi Kepemudaan Desa"
            anggota={ktAnggota}
          />
          <LembagaCard
            icon={<ShieldAlert className="w-7 h-7" />}
            colorBg="bg-green-50" colorText="text-green-600"
            title="Satlinmas" subtitle="Satuan Perlindungan Masyarakat"
            anggota={satlinmasAnggota}
          />
          <LembagaCard
            icon={<Activity className="w-7 h-7" />}
            colorBg="bg-red-50" colorText="text-red-500"
            title="Posyandu" subtitle="Pos Pelayanan Terpadu Kesehatan Balita & Lansia"
            anggota={posyanduAnggota}
          />
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
              <h2 className="text-xl md:text-2xl font-bold text-[#333]">Susunan Organisasi Pemerintahan</h2>
              <p className="text-sm text-[#666]">Struktur Organisasi dan Tata Kerja (SOTK) Pemerintah Desa Sambigede</p>
            </div>
          </div>
          
          <div className="w-full bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl p-4 mb-10 overflow-x-auto">
            <div className="min-w-[800px]">
              <img src={imgBagan} alt="Bagan SOTK Desa Sambigede" className="w-full h-auto object-contain rounded-lg" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#333] mb-4">Daftar Perangkat & Karyawan Desa</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-t border-[#E5E5E5]">
                <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">No</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">Nama Lengkap</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">Jabatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {(showAllPerangkat ? perangkatList : perangkatList.slice(0, 5)).map((p) => (
                    <tr key={p.no} className="hover:bg-[#F5F5F5] transition-colors">
                      <td className="px-5 py-3 text-[#999] text-xs w-16">{p.no}</td>
                      <td className="px-5 py-3 font-medium text-[#333]">{p.nama}</td>
                      <td className="px-5 py-3 text-[#666]">{p.jabatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {perangkatList.length > 5 && (
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => setShowAllPerangkat(!showAllPerangkat)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#6B8E23] hover:text-[#5A7A1E] transition-colors bg-[#6B8E23]/10 hover:bg-[#6B8E23]/20 px-4 py-2 rounded-full"
                >
                  {showAllPerangkat ? (
                    <><ChevronUp className="w-4 h-4" /> Tampilkan Lebih Sedikit</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" /> Tampilkan Semua Perangkat ({perangkatList.length})</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
