import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Activity, ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";

export default function StuntingTab() {
  const stuntingList = useQuery(api.stunting.getStunting);
  
  const calculateStats = () => {
    if (!stuntingList) return { total: 0, normal: 0, risiko: 0, stunting: 0 };
    return {
      total: stuntingList.length,
      normal: stuntingList.filter(s => s.status === "Normal").length,
      risiko: stuntingList.filter(s => s.status === "Risiko").length,
      stunting: stuntingList.filter(s => s.status === "Stunting").length,
    };
  };

  const stats = calculateStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm text-center">
        <h2 className="text-xl font-bold text-[#333] mb-4">Pemantauan Stunting Desa</h2>
        <p className="text-[#666] text-sm max-w-2xl mx-auto">
          Data pemantauan tumbuh kembang balita di Desa Sambigede. Kami berkomitmen untuk menurunkan angka stunting melalui pemantauan rutin dan pemberian gizi tambahan.
        </p>
      </div>

      {/* Cards Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">Total Balita Dipantau</span>
          </div>
          {stuntingList === undefined ? <Skeleton className="h-10 w-16" /> : <p className="text-3xl font-bold text-[#333]">{stats.total}</p>}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-green-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">Status Normal</span>
          </div>
          {stuntingList === undefined ? <Skeleton className="h-10 w-16" /> : <p className="text-3xl font-bold text-green-600">{stats.normal}</p>}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-yellow-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">Risiko Stunting</span>
          </div>
          {stuntingList === undefined ? <Skeleton className="h-10 w-16" /> : <p className="text-3xl font-bold text-yellow-600">{stats.risiko}</p>}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-red-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">Stunting</span>
          </div>
          {stuntingList === undefined ? <Skeleton className="h-10 w-16" /> : <p className="text-3xl font-bold text-red-600">{stats.stunting}</p>}
        </div>
      </div>

      {/* Tabel Data (Anonim) */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#E5E5E5] bg-[#F9F9F9]">
          <h3 className="font-bold text-[#333]">Data Rekapitulasi Pemantauan (Tersamar)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white border-b border-[#E5E5E5]">
              <tr>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs">Inisial / Nama</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs">Dusun</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs">Usia (Bulan)</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs">Berat (Kg)</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs">Tinggi (Cm)</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {stuntingList === undefined ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#999]">Memuat data...</td>
                </tr>
              ) : stuntingList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#999]">Belum ada data pemantauan.</td>
                </tr>
              ) : (
                stuntingList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F5F5]">
                    <td className="px-6 py-4 font-medium text-[#333]">{item.nama}</td>
                    <td className="px-6 py-4 text-[#666]">{item.dusun}</td>
                    <td className="px-6 py-4 text-[#666]">{item.usia}</td>
                    <td className="px-6 py-4 text-[#666]">{item.bb}</td>
                    <td className="px-6 py-4 text-[#666]">{item.tb}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${item.status === 'Normal' ? 'bg-green-100 text-green-700' : 
                          item.status === 'Risiko' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
