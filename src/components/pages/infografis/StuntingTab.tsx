import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useState, useEffect, useMemo } from 'react'
import {
  Activity,
  Users,
  UserCheck,
  Building2,
} from 'lucide-react'
import { Skeleton } from '../../ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export default function StuntingTab() {
  const periodeList = useQuery(api.stunting.getDistinctPeriode, {})
  const [selectedBulan, setSelectedBulan] = useState<number | undefined>(undefined)
  const [selectedTahun, setSelectedTahun] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (periodeList && periodeList.length > 0) {
      setSelectedBulan((prev) => prev ?? periodeList[0].bulan)
      setSelectedTahun((prev) => prev ?? periodeList[0].tahun)
    }
  }, [periodeList])

  const stuntingList = useQuery(
    api.stunting.getStunting,
    selectedBulan !== undefined && selectedTahun !== undefined
      ? { bulan: selectedBulan, tahun: selectedTahun }
      : 'skip',
  )

  const stats = useMemo(() => {
    if (!stuntingList) return { total: 0, laki: 0, perempuan: 0, pos: 0 }
    const posSet = new Set(stuntingList.map((s) => s.pos))
    return {
      total: stuntingList.length,
      laki: stuntingList.filter((s) => s.jk === 'L').length,
      perempuan: stuntingList.filter((s) => s.jk === 'P').length,
      pos: posSet.size,
    }
  }, [stuntingList])

  const periodeLabel =
    selectedBulan && MONTHS[selectedBulan - 1] && selectedTahun
      ? `${MONTHS[selectedBulan - 1]} ${selectedTahun}`
      : ''

  const isLoading = stuntingList === undefined

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm text-center">
        <h2 className="text-xl font-bold text-[#333] mb-4">
          Pemantauan Stunting Desa{periodeLabel ? ` Per ${periodeLabel}` : ''}
        </h2>
        <p className="text-[#666] text-sm max-w-2xl mx-auto mb-6">
          Data pemantauan tumbuh kembang balita di Desa Sambigede. Kami
          berkomitmen untuk menurunkan angka stunting melalui pemantauan rutin
          dan pemberian gizi tambahan.
        </p>

        <div className="flex justify-center">
          <Select
            value={
              selectedBulan !== undefined && selectedTahun !== undefined
                ? `${selectedBulan}-${selectedTahun}`
                : ''
            }
            onValueChange={(val) => {
              const [b, t] = val.split('-').map(Number)
              setSelectedBulan(b)
              setSelectedTahun(t)
            }}
            disabled={!periodeList || periodeList.length === 0}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              {periodeList?.map((p) => (
                <SelectItem
                  key={`${p.bulan}-${p.tahun}`}
                  value={`${p.bulan}-${p.tahun}`}
                >
                  {MONTHS[p.bulan - 1]} {p.tahun}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
              Total Balita
            </span>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <p className="text-3xl font-bold text-[#333]">{stats.total}</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-green-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
              Laki-laki
            </span>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <p className="text-3xl font-bold text-green-600">{stats.laki}</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-yellow-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
              Perempuan
            </span>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <p className="text-3xl font-bold text-yellow-600">
              {stats.perempuan}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] hover:border-red-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-[#666] uppercase tracking-wider">
              Posyandu
            </span>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <p className="text-3xl font-bold text-red-600">{stats.pos}</p>
          )}
        </div>
      </div>
    </div>
  )
}
