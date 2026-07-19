import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Search, Gift, PackageOpen, CheckCircle2, XCircle, Filter, PieChart, Users, Activity, Package } from "lucide-react";

// Utility untuk menyensor NIK (e.g. 3505010101850001 -> 3505**********01)
const maskNik = (nik: string) => {
  if (!nik || nik.length < 8) return nik;
  return nik.substring(0, 4) + "*".repeat(nik.length - 6) + nik.substring(nik.length - 2);
};

export default function BansosTab() {
  const bansosList = useQuery(api.bansos.getBansos);

  // States for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterJenis, setFilterJenis] = useState("Semua");

  // Hitung KPI
  const kpi = useMemo(() => {
    if (!bansosList) return { total: 0, aktif: 0, pkh: 0, bpnt: 0 };
    
    return bansosList.reduce(
      (acc, curr) => {
        acc.total++;
        if (curr.status === "Aktif") acc.aktif++;
        if (curr.jenisBansos === "PKH") acc.pkh++;
        if (curr.jenisBansos === "BPNT") acc.bpnt++;
        return acc;
      },
      { total: 0, aktif: 0, pkh: 0, bpnt: 0 }
    );
  }, [bansosList]);

  // Hitung Sebaran Bantuan Sosial (Pie / Bar Distribution)
  const distribution = useMemo(() => {
    if (!bansosList) return [];
    
    const count: Record<string, number> = {
      "PKH": 0,
      "BPNT": 0,
      "BLT Dana Desa": 0,
      "Bantuan Dana Pangan": 0,
      "Lainnya": 0
    };

    bansosList.forEach(b => {
      if (b.jenisBansos in count) {
        count[b.jenisBansos]++;
      } else {
        count["Lainnya"]++;
      }
    });

    const total = bansosList.length || 1; // hindari division by zero
    const colors: Record<string, string> = {
      "PKH": "bg-emerald-500",
      "BPNT": "bg-blue-500",
      "BLT Dana Desa": "bg-indigo-500",
      "Bantuan Pangan": "bg-amber-500",
      "Lainnya": "bg-gray-400"
    };

    return Object.keys(count).map(key => ({
      name: key,
      value: count[key],
      percentage: Math.round((count[key] / total) * 100),
      color: colors[key]
    })).sort((a, b) => b.value - a.value);
  }, [bansosList]);

  // Filtered List for Search
  const filteredBansos = useMemo(() => {
    if (!bansosList) return [];
    return bansosList.filter(b => {
      const matchSearch = b.nama.toLowerCase().includes(searchQuery.toLowerCase()) || b.nik.includes(searchQuery);
      const matchStatus = filterStatus === "Semua" || b.status === filterStatus;
      const matchJenis = filterJenis === "Semua" || b.jenisBansos === filterJenis;
      return matchSearch && matchStatus && matchJenis;
    });
  }, [bansosList, searchQuery, filterStatus, filterJenis]);

  if (bansosList === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B8E23]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Penerima</p>
            <h3 className="text-3xl font-bold text-gray-800">{kpi.total}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Penerima Aktif</p>
            <h3 className="text-3xl font-bold text-gray-800">{kpi.aktif}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Gift className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Penerima PKH</p>
            <h3 className="text-3xl font-bold text-gray-800">{kpi.pkh}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Penerima BPNT</p>
            <h3 className="text-3xl font-bold text-gray-800">{kpi.bpnt}</h3>
          </div>
        </div>
      </div>

      {/* Distribution of Bansos */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <PieChart className="text-[#6B8E23]" /> Sebaran Jenis Bantuan Sosial
        </h2>

        {/* Bar Chart Visualization */}
        <div className="h-4 flex rounded-full overflow-hidden mb-6 bg-gray-100">
          {distribution.map((d, i) => (
            d.value > 0 && (
              <div 
                key={i} 
                className={`${d.color} h-full transition-all duration-500 hover:opacity-80 cursor-pointer`}
                style={{ width: `${d.percentage}%` }}
                title={`${d.name}: ${d.percentage}%`}
              ></div>
            )
          ))}
        </div>

        {/* Legend & Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {distribution.map((d, i) => (
            <div key={i} className="flex flex-col gap-1 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-3 h-3 rounded-full ${d.color}`}></span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{d.name}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800 leading-none">{d.value}</span>
                <span className="text-sm text-gray-400 font-medium leading-none mb-0.5">({d.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Search className="text-[#6B8E23]" /> Cek Data Penerima
            </h2>
            <p className="text-gray-500 text-sm mt-1">Cari berdasarkan NIK atau Nama Lengkap untuk mengecek status bantuan.</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Masukkan NIK atau Nama Lengkap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl outline-none transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-9 pr-8 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl outline-none transition-all text-sm font-medium text-gray-700"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div className="relative">
              <PackageOpen className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select 
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="appearance-none pl-9 pr-8 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 rounded-xl outline-none transition-all text-sm font-medium text-gray-700"
              >
                <option value="Semua">Semua Bansos</option>
                <option value="PKH">PKH</option>
                <option value="BPNT">BPNT</option>
                <option value="BLT Dana Desa">BLT Dana Desa</option>
                <option value="Bantuan Pangan">Bantuan Pangan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {searchQuery.trim().length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="py-4 px-6 font-semibold">Nama & NIK</th>
                  <th className="py-4 px-6 font-semibold">Alamat</th>
                  <th className="py-4 px-6 font-semibold">Jenis Bantuan</th>
                  <th className="py-4 px-6 font-semibold">Status & Periode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBansos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-3">
                        <XCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Data tidak ditemukan.</p>
                      <p className="text-gray-400 text-xs mt-1">Coba gunakan kata kunci atau filter lain.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBansos.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-800">{item.nama}</p>
                        <p className="font-mono text-gray-500 text-xs mt-0.5 tracking-wider bg-gray-100 inline-block px-1.5 py-0.5 rounded">
                          {maskNik(item.nik)}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        RT {item.rt} / RW {item.rw}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                          <Gift className="w-3 h-3" /> {item.jenisBansos}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.status === 'Aktif' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.status === 'Aktif' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{item.periode}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Ketik NIK atau Nama Lengkap untuk melihat data pencarian.</p>
            <p className="text-gray-400 text-sm mt-1">Data ditampilkan secara aman dengan penyensoran informasi pribadi (NIK).</p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <InfoIcon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1.5">Informasi Penyaluran Bansos</h4>
          <p className="text-blue-800/80 text-sm leading-relaxed">
            Penyaluran Bantuan Sosial dilakukan secara bertahap sesuai dengan jadwal dari Kementerian Sosial dan Pemerintah Daerah. 
            Jika Anda merasa berhak namun belum terdaftar, silakan melapor ke Kantor Balai Desa dengan membawa fotokopi Kartu Keluarga (KK) dan KTP. 
            <strong> Transparansi ini disajikan untuk mendukung program keterbukaan informasi publik Pemerintah Desa Sambigede.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
