import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Landmark, ArrowUpRight, ArrowDownRight, Activity, Search, Filter } from 'lucide-react'
import { Skeleton } from '../../ui/skeleton'
import { useState, useMemo } from 'react'

export default function ApbdesTab() {
  const activeTahun = useQuery(api.apbdes.getApbdesTahunActive)
  const apbdesList = useQuery(api.apbdes.getActiveApbdesItems)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterBidang, setFilterBidang] = useState<string>('Semua')

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka)
  }

  // Derive unique Bidang from data for filtering
  const availableBidang = useMemo(() => {
    if (!apbdesList) return []
    const bidangSet = new Set<string>()
    apbdesList.forEach(item => {
      if (item.kategori === 'Belanja' && item.bidang) {
        bidangSet.add(item.bidang)
      }
    })
    return Array.from(bidangSet)
  }, [apbdesList])

  const filteredItems = useMemo(() => {
    if (!apbdesList) return []
    return apbdesList.filter(item => {
      const matchSearch = item.uraian.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.sumberDana && item.sumberDana.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchBidang = filterBidang === 'Semua' || item.bidang === filterBidang || item.kategori !== 'Belanja' // Always show Pendapatan/Pembiayaan if not filtering specific Belanja, or we can just filter all. Let's filter everything strictly if a bidang is selected.
      
      // If a specific bidang is selected, only show items matching that bidang.
      if (filterBidang !== 'Semua') {
        return item.bidang === filterBidang && matchSearch
      }
      
      return matchSearch
    })
  }, [apbdesList, searchTerm, filterBidang])

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gradient-to-br from-[#1F3D2B] to-[#3F7D4A] rounded-3xl p-8 md:p-12 shadow-xl text-center relative overflow-hidden">
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-300 opacity-10 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm text-sm font-medium border border-white/10">
            <Landmark className="w-4 h-4" />
            Tahun Anggaran {activeTahun?.tahun || '...'} ({activeTahun?.jenis || '...'})
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Transparansi APBDes
          </h2>
          <p className="text-emerald-50 text-sm md:text-base max-w-2xl mx-auto font-medium opacity-90 leading-relaxed">
            Laporan realisasi Anggaran Pendapatan dan Belanja Desa (APBDes)
            Sambigede. Kami menjunjung tinggi prinsip transparansi dan
            akuntabilitas dalam pengelolaan keuangan desa untuk kesejahteraan bersama.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-[#E5E5E5] relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-500 mb-1">Pendapatan Desa</h3>
            {activeTahun === undefined ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">
                  {formatRupiah(activeTahun?.totalPendapatan || 0)}
                </p>
                {activeTahun?.totalPendapatanSemula !== undefined && activeTahun?.totalPendapatanSemula !== activeTahun?.totalPendapatan && (
                  <p className="text-sm text-slate-500 mt-1">
                    <span className="text-emerald-600 font-medium">Semula: </span>
                    {formatRupiah(activeTahun.totalPendapatanSemula)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-[#E5E5E5] relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-500 mb-1">Belanja Desa</h3>
            {activeTahun === undefined ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <div>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">
                  {formatRupiah(activeTahun?.totalBelanja || 0)}
                </p>
                {activeTahun?.totalBelanjaSemula !== undefined && activeTahun?.totalBelanjaSemula !== activeTahun?.totalBelanja && (
                  <p className="text-sm text-slate-500 mt-1">
                    <span className="text-red-600 font-medium">Semula: </span>
                    {formatRupiah(activeTahun.totalBelanjaSemula)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-[#E5E5E5] relative overflow-hidden transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-500 mb-1">Pembiayaan (Netto)</h3>
            {activeTahun === undefined ? (
              <Skeleton className="h-8 w-3/4" />
            ) : (
              <p className="text-2xl md:text-3xl font-bold text-slate-800">
                {formatRupiah(activeTahun?.pembiayaanNetto || 0)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5E5E5] bg-[#F9F9F9] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <Landmark className="w-5 h-5 text-emerald-600" /> Rincian APBDes
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari kegiatan/sumber..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterBidang}
                onChange={(e) => setFilterBidang(e.target.value)}
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm w-full sm:w-auto appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer transition-all"
              >
                <option value="Semua">Semua Kategori</option>
                {availableBidang.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm text-left">
            <thead className="bg-white border-b border-[#E5E5E5]">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                  Uraian / Nama Program
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">
                  Kategori
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">
                  Anggaran Semula
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">
                  Anggaran Menjadi
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">
                  Kurang / Lebih
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apbdesList === undefined ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </td>
                </tr>
              ) : apbdesList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Landmark className="w-8 h-8 text-slate-300" />
                    </div>
                    Belum ada data rincian APBDes untuk tahun ini.
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Tidak ditemukan data yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const selisih = (item.anggaranMenjadi || 0) - (item.anggaranSemula || 0)
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {item.uraian}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {item.sumberDana && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              {item.sumberDana}
                            </span>
                          )}
                          {item.bidang && (
                            <span className="text-xs text-slate-500 truncate max-w-xs" title={item.bidang}>
                              {item.bidang}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top pt-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide
                          ${
                            item.kategori === 'Pendapatan'
                              ? 'bg-emerald-100/50 text-emerald-700 border border-emerald-200'
                              : item.kategori === 'Belanja'
                                ? 'bg-red-100/50 text-red-700 border border-red-200'
                                : 'bg-blue-100/50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top pt-5 text-right font-medium text-slate-500 whitespace-nowrap">
                        {formatRupiah(item.anggaranSemula || 0)}
                      </td>
                      <td className="px-6 py-4 align-top pt-5 text-right font-bold text-slate-800 whitespace-nowrap">
                        {formatRupiah(item.anggaranMenjadi || 0)}
                      </td>
                      <td className={`px-6 py-4 align-top pt-5 text-right font-bold whitespace-nowrap ${selisih > 0 ? 'text-emerald-600' : selisih < 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {selisih > 0 ? '+' : ''}{formatRupiah(selisih)}
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
  )
}
