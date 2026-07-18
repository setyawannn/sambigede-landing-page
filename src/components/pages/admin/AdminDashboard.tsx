import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Users, Newspaper, Package, Activity, Landmark, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const penduduk = useQuery(api.penduduk.getPenduduk);
  const berita = useQuery(api.berita.getBerita, { category: undefined });
  const bansos = useQuery(api.bansos.getBansos);
  const stunting = useQuery(api.stunting.getStunting);
  const apbdes = useQuery(api.apbdes.getApbdes);

  const stats = [
    { title: "Total Penduduk", value: penduduk?.length ?? "...", icon: <Users className="text-blue-500" />, bg: "bg-blue-50" },
    { title: "Artikel Berita", value: berita?.length ?? "...", icon: <Newspaper className="text-orange-500" />, bg: "bg-orange-50" },
    { title: "Penerima Bansos", value: bansos?.length ?? "...", icon: <Package className="text-green-500" />, bg: "bg-green-50" },
    { title: "Data Stunting", value: stunting?.length ?? "...", icon: <Activity className="text-red-500" />, bg: "bg-red-50" },
  ];

  const totalPendapatan = apbdes?.filter(a => a.kategori === "Pendapatan").reduce((acc, curr) => acc + curr.realisasi, 0) ?? 0;
  
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Statistik</h2>
          <p className="text-gray-500 text-sm mt-1">Ringkasan data sistem informasi Desa Sambigede</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 shadow-sm">
          <TrendingUp className="w-4 h-4 text-[#6B8E23]" />
          <span>Update Terakhir: Hari ini</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-[#6B8E23]/30 transition-colors">
            <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-800 leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Dashboards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Realisasi APBDes Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-500" />
              Realisasi Pendapatan Desa
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Total Pendapatan Terrealisasi</p>
            <h2 className="text-4xl font-black text-indigo-600 mb-2">
              {formatRupiah(totalPendapatan)}
            </h2>
            <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
              +12.5% dari tahun lalu
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Aksi Cepat</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-xl flex flex-col items-center text-center hover:bg-[#6B8E23]/5 hover:border-[#6B8E23] transition-colors group">
              <Newspaper className="w-8 h-8 text-gray-400 group-hover:text-[#6B8E23] mb-3 transition-colors" />
              <span className="font-medium text-gray-700 text-sm">Tulis Berita</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl flex flex-col items-center text-center hover:bg-[#6B8E23]/5 hover:border-[#6B8E23] transition-colors group">
              <Users className="w-8 h-8 text-gray-400 group-hover:text-[#6B8E23] mb-3 transition-colors" />
              <span className="font-medium text-gray-700 text-sm">Tambah Warga</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl flex flex-col items-center text-center hover:bg-[#6B8E23]/5 hover:border-[#6B8E23] transition-colors group">
              <Package className="w-8 h-8 text-gray-400 group-hover:text-[#6B8E23] mb-3 transition-colors" />
              <span className="font-medium text-gray-700 text-sm">Update Bansos</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-xl flex flex-col items-center text-center hover:bg-[#6B8E23]/5 hover:border-[#6B8E23] transition-colors group">
              <Activity className="w-8 h-8 text-gray-400 group-hover:text-[#6B8E23] mb-3 transition-colors" />
              <span className="font-medium text-gray-700 text-sm">Laporan Stunting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
