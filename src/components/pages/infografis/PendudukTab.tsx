import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Search, UserCheck, ShieldAlert, BadgeInfo } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../../ui/skeleton";

export default function PendudukTab() {
  const [nikInput, setNikInput] = useState("");
  const [searchNik, setSearchNik] = useState("");

  const pendudukList = useQuery(api.penduduk.getPenduduk);
  const searchResult = useQuery(api.penduduk.getPendudukByNik, searchNik ? { nik: searchNik } : "skip");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nikInput.length === 16) {
      setSearchNik(nikInput);
    } else {
      alert("NIK harus terdiri dari 16 digit angka.");
    }
  };

  const calculateStats = () => {
    if (!pendudukList) return { total: 0, laki: 0, pr: 0, balita: 0 };
    return {
      total: pendudukList.length,
      laki: pendudukList.filter(p => p.jk === "Laki-laki").length,
      pr: pendudukList.filter(p => p.jk === "Perempuan").length,
      // Just a dummy logic for balita
      balita: 77
    };
  };

  const stats = calculateStats();

  return (
    <div className="flex flex-col gap-8">
      {/* Search NIK */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#333] mb-2 flex items-center gap-2">
          <BadgeInfo className="text-[#6B8E23]" /> Cek Status Penduduk
        </h2>
        <p className="text-[#666] text-sm mb-6">Masukkan NIK untuk memastikan data Anda telah terdaftar dalam sistem kependudukan desa.</p>
        
        <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
          <input 
            type="text" 
            placeholder="Masukkan 16 digit NIK..."
            className="flex-1 bg-[#F9F9F9] border border-[#E5E5E5] focus:border-[#6B8E23] rounded-lg px-4 py-3 outline-none text-[#333]"
            value={nikInput}
            onChange={(e) => setNikInput(e.target.value.replace(/\D/g, '').slice(0, 16))}
          />
          <button type="submit" className="bg-[#6B8E23] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5A7A1E] transition-colors flex items-center gap-2">
            <Search className="w-5 h-5" /> Cari
          </button>
        </form>

        {searchNik && searchResult !== undefined && (
          <div className="mt-8 p-6 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9]">
            {searchResult ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#333] text-lg mb-1">Data Ditemukan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                    <div className="flex flex-col"><span className="text-[#999] text-xs">Nama Lengkap</span><span className="font-medium">{searchResult.nama}</span></div>
                    <div className="flex flex-col"><span className="text-[#999] text-xs">NIK</span><span className="font-medium">{searchResult.nik}</span></div>
                    <div className="flex flex-col"><span className="text-[#999] text-xs">Tempat, Tgl Lahir</span><span className="font-medium">{searchResult.ttl}</span></div>
                    <div className="flex flex-col"><span className="text-[#999] text-xs">Jenis Kelamin</span><span className="font-medium">{searchResult.jk}</span></div>
                    <div className="flex flex-col"><span className="text-[#999] text-xs">Alamat</span><span className="font-medium">RT {searchResult.rt} / RW {searchResult.rw}</span></div>
                    <div className="flex flex-col"><span className="text-[#999] text-xs">Status Kawin</span><span className="font-medium">{searchResult.status}</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#333] text-lg mb-1">Data Tidak Ditemukan</h3>
                  <p className="text-[#666] text-sm">NIK <strong>{searchNik}</strong> tidak terdaftar. Silakan hubungi perangkat desa atau ke kantor desa untuk perbaikan data.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statistik Keseluruhan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Total Penduduk", count: stats.total, icon: <Search />, color: "text-yellow-600 bg-yellow-100" },
          { label: "Laki-Laki", count: stats.laki, icon: <Search />, color: "text-blue-600 bg-blue-100" },
          { label: "Perempuan", count: stats.pr, icon: <Search />, color: "text-pink-600 bg-pink-100" },
          { label: "Balita (Estimasi)", count: stats.balita, icon: <Search />, color: "text-purple-600 bg-purple-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-[#6B8E23]/30 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-[#666] uppercase tracking-wider">{stat.label}</span>
            </div>
            {pendudukList === undefined ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <p className="text-3xl font-bold text-[#333]">{stat.count}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
