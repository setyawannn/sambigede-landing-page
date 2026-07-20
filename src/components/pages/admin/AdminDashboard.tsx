import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Users,
  Newspaper,
  Package,
  Activity,
  Landmark,
  TrendingUp,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../ui/card'
import { Button } from '../../ui/button'

export default function AdminDashboard() {
  const penduduk = useQuery(api.penduduk.getPenduduk)
  const berita = useQuery(api.berita.getBerita, { category: undefined })
  const bansos = useQuery(api.bansos.getBansos)
  const stunting = useQuery(api.stunting.getStunting)
  const apbdes = useQuery(api.apbdes.getApbdes)

  const stats = [
    {
      title: 'Total Penduduk',
      value: penduduk?.length ?? '...',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Artikel Berita',
      value: berita?.length ?? '...',
      icon: Newspaper,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      title: 'Penerima Bansos',
      value: bansos?.length ?? '...',
      icon: Package,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      title: 'Data Stunting',
      value: stunting?.length ?? '...',
      icon: Activity,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
    },
  ]

  const totalPendapatan =
    apbdes
      ?.filter((a) => a.kategori === 'Pendapatan')
      .reduce((acc, curr) => acc + curr.realisasi, 0) ?? 0

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">
            Dashboard Statistik
          </h2>
          <p className="text-slate-500 mt-1">
            Ringkasan data sistem informasi Desa Sambigede
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm text-slate-600 shadow-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="font-medium">Update Terakhir: Hari ini</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="hover:border-primary/50 transition-colors shadow-sm"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-slate-800 leading-none">
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Dashboards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Realisasi APBDes Summary */}
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl">
                Realisasi Pendapatan Desa
              </CardTitle>
              <CardDescription>
                Akumulasi penerimaan APBDes tahun berjalan
              </CardDescription>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                {formatRupiah(totalPendapatan)}
              </h2>
              <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                +12.5% dari tahun lalu
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Pintasan untuk manajemen data utama
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-3 text-slate-600 hover:text-primary hover:border-primary/50 group"
              >
                <Newspaper className="w-8 h-8 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary" />
                <span className="font-semibold text-sm">Tulis Berita</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-3 text-slate-600 hover:text-primary hover:border-primary/50 group"
              >
                <Users className="w-8 h-8 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary" />
                <span className="font-semibold text-sm">Tambah Warga</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-3 text-slate-600 hover:text-primary hover:border-primary/50 group"
              >
                <Package className="w-8 h-8 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary" />
                <span className="font-semibold text-sm">Update Bansos</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-3 text-slate-600 hover:text-primary hover:border-primary/50 group"
              >
                <Activity className="w-8 h-8 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary" />
                <span className="font-semibold text-sm">Data Stunting</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
