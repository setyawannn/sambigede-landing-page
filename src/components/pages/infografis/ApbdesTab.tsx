import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Landmark, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";

export default function ApbdesTab() {
  const apbdesList = useQuery(api.apbdes.getApbdes);

  const calculateTotals = () => {
    if (!apbdesList) return { pendapatan: 0, belanja: 0, pembiayaan: 0 };
    return {
      pendapatan: apbdesList.filter(a => a.kategori === "Pendapatan").reduce((acc, curr) => acc + curr.realisasi, 0),
      belanja: apbdesList.filter(a => a.kategori === "Belanja").reduce((acc, curr) => acc + curr.realisasi, 0),
      pembiayaan: apbdesList.filter(a => a.kategori === "Pembiayaan").reduce((acc, curr) => acc + curr.realisasi, 0),
    };
  };

  const totals = calculateTotals();
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm text-center">
        <h2 className="text-xl font-bold text-[#333] mb-4">Transparansi Anggaran (APBDes)</h2>
        <p className="text-[#666] text-sm max-w-2xl mx-auto">
          Laporan realisasi Anggaran Pendapatan dan Belanja Desa (APBDes) Sambigede. Kami menjunjung tinggi prinsip transparansi dan akuntabilitas dalam pengelolaan keuangan desa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
          <div className="flex items-center gap-3 mb-4 text-green-600">
            <ArrowDownRight className="w-6 h-6" />
            <h3 className="font-bold">Total Pendapatan</h3>
          </div>
          {apbdesList === undefined ? <Skeleton className="h-10 w-3/4" /> : <p className="text-2xl font-bold text-[#333]">{formatRupiah(totals.pendapatan)}</p>}
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <ArrowUpRight className="w-6 h-6" />
            <h3 className="font-bold">Total Belanja</h3>
          </div>
          {apbdesList === undefined ? <Skeleton className="h-10 w-3/4" /> : <p className="text-2xl font-bold text-[#333]">{formatRupiah(totals.belanja)}</p>}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Activity className="w-6 h-6" />
            <h3 className="font-bold">Pembiayaan</h3>
          </div>
          {apbdesList === undefined ? <Skeleton className="h-10 w-3/4" /> : <p className="text-2xl font-bold text-[#333]">{formatRupiah(totals.pembiayaan)}</p>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#E5E5E5] bg-[#F9F9F9] flex items-center justify-between">
          <h3 className="font-bold text-[#333] flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#6B8E23]" /> Rincian APBDes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white border-b border-[#E5E5E5]">
              <tr>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs">Uraian / Nama Program</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs">Kategori</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs text-right">Anggaran</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs text-right">Realisasi</th>
                <th className="px-6 py-4 font-semibold text-[#333] uppercase tracking-wide text-xs text-center">Capaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {apbdesList === undefined ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#999]">Memuat data...</td>
                </tr>
              ) : apbdesList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#999]">Belum ada data APBDes.</td>
                </tr>
              ) : (
                apbdesList.map((item, idx) => {
                  const capaian = item.nilai > 0 ? (item.realisasi / item.nilai) * 100 : 0;
                  return (
                    <tr key={idx} className="hover:bg-[#F5F5F5]">
                      <td className="px-6 py-4 font-medium text-[#333]">
                        {item.nama}
                        <div className="text-xs text-[#999] mt-1">Sumber: {item.sumberDana}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${item.kategori === 'Pendapatan' ? 'bg-green-100 text-green-700' : 
                            item.kategori === 'Belanja' ? 'bg-red-100 text-red-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[#666]">{formatRupiah(item.nilai)}</td>
                      <td className="px-6 py-4 text-right font-medium text-[#333]">{formatRupiah(item.realisasi)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 max-w-[100px] mx-auto">
                          <div className="bg-[#6B8E23] h-2.5 rounded-full" style={{ width: `${Math.min(capaian, 100)}%` }}></div>
                        </div>
                        <span className="text-xs text-[#666]">{capaian.toFixed(1)}%</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
