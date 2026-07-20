import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Users,
  User,
  UserCheck,
  Home,
  Briefcase,
  Shield,
  Search,
} from 'lucide-react'
import { useState } from 'react'
import { Skeleton } from '../../ui/skeleton'
import { Input } from '../../ui/input'

export default function PendudukTab() {
  const [activeTab, setActiveTab] = useState<
    'pekerjaan' | 'usia' | 'pendidikan' | 'agama'
  >('pekerjaan')
  const [searchPekerjaan, setSearchPekerjaan] = useState('')

  const summary = useQuery(api.demografi.getSummary)
  const pekerjaanList = useQuery(api.demografi.getPekerjaan)
  const usiaList = useQuery(api.demografi.getUsia)
  const pendidikanList = useQuery(api.demografi.getPendidikan)
  const agamaList = useQuery(api.demografi.getAgama)

  const renderSkeleton = () => (
    <div className="space-y-4 mt-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )

  return (
    <div className="flex flex-col gap-8">
      {/* 6 KPI Metric Highlight Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: 'Total Penduduk',
            count: summary?.totalPenduduk,
            icon: <Users className="w-5 h-5" />,
            color: 'text-blue-600 bg-blue-100',
          },
          {
            label: 'Laki-Laki',
            count: summary?.jumlahLaki,
            icon: <User className="w-5 h-5" />,
            color: 'text-indigo-600 bg-indigo-100',
          },
          {
            label: 'Perempuan',
            count: summary?.jumlahPerempuan,
            icon: <UserCheck className="w-5 h-5" />,
            color: 'text-pink-600 bg-pink-100',
          },
          {
            label: 'Kepala Keluarga',
            count: summary?.jumlahKK,
            icon: <Home className="w-5 h-5" />,
            color: 'text-orange-600 bg-orange-100',
          },
          {
            label: 'Usia Produktif',
            count: summary?.usiaProduktif,
            icon: <Briefcase className="w-5 h-5" />,
            color: 'text-green-600 bg-green-100',
          },
          {
            label: 'Usia Lanjut >50',
            count: summary?.usiaLanjut50Plus,
            icon: <Shield className="w-5 h-5" />,
            color: 'text-purple-600 bg-purple-100',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5] flex flex-col items-center text-center"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stat.color}`}
            >
              {stat.icon}
            </div>
            <span className="text-xs font-medium text-[#666] mb-1">
              {stat.label}
            </span>
            {summary === undefined ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-xl font-bold text-[#333]">
                {stat.count?.toLocaleString('id-ID')}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Segmented Tabs */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-[#E5E5E5] pb-4 mb-6">
          {[
            { id: 'pekerjaan', label: 'Mata Pencaharian' },
            { id: 'usia', label: 'Kelompok Usia' },
            { id: 'pendidikan', label: 'Tingkat Pendidikan' },
            { id: 'agama', label: 'Agama' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#6B8E23] text-white shadow-md shadow-[#6B8E23]/20'
                  : 'text-[#666] bg-[#F9F9F9] hover:bg-[#E5E5E5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {/* PEKERJAAN */}
          {activeTab === 'pekerjaan' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 max-w-sm mb-4">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Cari pekerjaan..."
                    value={searchPekerjaan}
                    onChange={(e) => setSearchPekerjaan(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              {pekerjaanList === undefined ? (
                renderSkeleton()
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-[#333]">
                          Jenis Pekerjaan
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Laki-Laki
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Perempuan
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {pekerjaanList
                        .filter((p) =>
                          p.pekerjaan
                            .toLowerCase()
                            .includes(searchPekerjaan.toLowerCase()),
                        )
                        .sort(
                          (a, b) =>
                            b.jumlahLaki +
                            b.jumlahPerempuan -
                            (a.jumlahLaki + a.jumlahPerempuan),
                        )
                        .map((item, idx) => {
                          const total = item.jumlahLaki + item.jumlahPerempuan
                          return (
                            <tr key={idx} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 font-medium text-[#333]">
                                {item.pekerjaan}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {item.jumlahLaki.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {item.jumlahPerempuan.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right font-bold">
                                {total.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* USIA */}
          {activeTab === 'usia' && (
            <div className="space-y-4">
              {usiaList === undefined ? (
                renderSkeleton()
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-[#333]">
                          Kelompok Usia
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Laki-Laki
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Perempuan
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Jumlah
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Persentase
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {usiaList.map((item, idx) => {
                        const total = item.jumlahLaki + item.jumlahPerempuan
                        const percentage = summary?.totalPenduduk
                          ? ((total / summary.totalPenduduk) * 100).toFixed(1)
                          : 0
                        return (
                          <tr key={idx} className="hover:bg-[#F5F5F5]">
                            <td className="px-4 py-3 font-medium text-[#333]">
                              {item.kelompokUsia}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {item.jumlahLaki.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {item.jumlahPerempuan.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-3 text-right font-bold">
                              {total.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-3 text-right text-[#666]">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-[#6B8E23] h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="w-10">{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PENDIDIKAN */}
          {activeTab === 'pendidikan' && (
            <div className="space-y-4">
              {pendidikanList === undefined ? (
                renderSkeleton()
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-[#333]">
                          Tingkat Pendidikan
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Laki-Laki
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Perempuan
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Jumlah
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Persentase
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {pendidikanList
                        .filter(
                          (item) => item.jumlahLaki + item.jumlahPerempuan > 0,
                        )
                        .map((item, idx) => {
                          const total = item.jumlahLaki + item.jumlahPerempuan
                          const percentage = summary?.totalPenduduk
                            ? ((total / summary.totalPenduduk) * 100).toFixed(1)
                            : 0
                          return (
                            <tr key={idx} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 font-medium text-[#333]">
                                {item.tingkat}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {item.jumlahLaki.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {item.jumlahPerempuan.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right font-bold">
                                {total.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right text-[#666]">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-[#6B8E23] h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="w-10">{percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* AGAMA */}
          {activeTab === 'agama' && (
            <div className="space-y-4">
              {agamaList === undefined ? (
                renderSkeleton()
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-[#333]">
                          Agama
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Laki-Laki
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Perempuan
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Jumlah
                        </th>
                        <th className="px-4 py-3 font-semibold text-[#333] text-right">
                          Persentase
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {agamaList
                        .filter(
                          (item) => item.jumlahLaki + item.jumlahPerempuan > 0,
                        )
                        .map((item, idx) => {
                          const total = item.jumlahLaki + item.jumlahPerempuan
                          const percentage = summary?.totalPenduduk
                            ? ((total / summary.totalPenduduk) * 100).toFixed(1)
                            : 0
                          return (
                            <tr key={idx} className="hover:bg-[#F5F5F5]">
                              <td className="px-4 py-3 font-medium text-[#333]">
                                {item.agama}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {item.jumlahLaki.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {item.jumlahPerempuan.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right font-bold">
                                {total.toLocaleString('id-ID')}
                              </td>
                              <td className="px-4 py-3 text-right text-[#666]">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-[#6B8E23] h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="w-10">{percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
