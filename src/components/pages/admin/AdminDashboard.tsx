import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Link } from '@tanstack/react-router'
import {
  Users,
  Newspaper,
  Package,
  Landmark,
  MessageSquare,
  Clock,
  ArrowRight,
  Database,
  Cloud,
  ShieldCheck,
  Activity
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import R2Image from '../../ui/R2Image'
import { format } from 'date-fns'
import { id as localeID } from 'date-fns/locale'
import { useAuth } from '../../../lib/auth'

export default function AdminDashboard() {
  const { user } = useAuth()
  
  // Optimized queries
  const summary = useQuery(api.demografi.getSummary)
  const berita = useQuery(api.berita.getBerita, { category: undefined })
  const pengaduan = useQuery(api.pengaduan.getPengaduanList)
  const activeTahun = useQuery(api.apbdes.getApbdesTahunActive)

  // Data processing
  const totalPendapatan = activeTahun?.totalPendapatan ?? 0

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka)
  }

  // Gender proportion
  const totalLaki = summary?.jumlahLaki ?? 0
  const totalPerempuan = summary?.jumlahPerempuan ?? 0
  const totalGender = totalLaki + totalPerempuan
  const percLaki = totalGender > 0 ? Math.round((totalLaki / totalGender) * 100) : 50
  const percPerempuan = totalGender > 0 ? 100 - percLaki : 50

  const stats = [
    {
      title: 'Total Penduduk',
      value: summary?.totalPenduduk ?? '...',
      subtext: `${summary?.jumlahKK ?? 0} KK`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/admin/infografis/penduduk'
    },
    {
      title: 'Anggaran APBDes',
      value: formatRupiah(totalPendapatan),
      subtext: `Tahun Anggaran ${activeTahun?.tahun ?? '...'}`,
      icon: Landmark,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      link: '/admin/infografis/apbdes'
    },
    {
      title: 'Pengaduan Warga',
      value: pengaduan?.length ?? '...',
      subtext: 'Laporan masuk tercatat',
      icon: MessageSquare,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      link: '/admin/pengaduan'
    },
    {
      title: 'Artikel Berita',
      value: berita?.length ?? '...',
      subtext: 'Publikasi & Pengumuman',
      icon: Newspaper,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      link: '/admin/berita'
    },
  ]

  return (
    <div className="space-y-8 pb-8">
      
      {/* 4-Card Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link key={i} to={stat.link} className="block group">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all h-full bg-white">
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {stat.subtext}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Wider Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Laporan Pengaduan Terbaru */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <CardTitle className="text-lg">Pengaduan Warga Terbaru</CardTitle>
                <CardDescription>Daftar keluhan dan masukan yang perlu ditindaklanjuti.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-slate-500 hover:text-primary">
                <Link to="/admin/pengaduan">Lihat Semua <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {pengaduan === undefined ? (
                <div className="p-8 text-center text-slate-400 animate-pulse">Memuat data...</div>
              ) : pengaduan.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <ShieldCheck className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Belum ada pengaduan masuk.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pengaduan.slice(0, 3).map(p => (
                    <div key={p._id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 sm:items-start">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-700">
                            {p.kategoriNama}
                          </Badge>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(p._creationTime), 'dd MMM yyyy', { locale: localeID })}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800">{p.namaLengkap}</h4>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {p.detailPesan}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Berita Terkini */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <CardTitle className="text-lg">Berita & Pengumuman</CardTitle>
                <CardDescription>Publikasi terakhir di portal desa.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-slate-500 hover:text-primary">
                <Link to="/admin/berita">Kelola Berita <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
               {berita === undefined ? (
                <div className="p-8 text-center text-slate-400 animate-pulse">Memuat data...</div>
              ) : berita.length === 0 ? (
                <div className="p-12 text-center text-slate-500">Belum ada berita yang dipublikasikan.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {berita.slice(0, 3).map(b => (
                    <div key={b._id} className="p-5 flex gap-4 hover:bg-slate-50 transition-colors">
                       {b.imageUrl ? (
                         <R2Image
                            src={b.imageUrl}
                            alt={b.title}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover object-center rounded-lg bg-slate-100 shrink-0 border border-slate-100"
                          />
                       ) : (
                         <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-100">
                           <Newspaper className="w-8 h-8 text-slate-400" />
                         </div>
                       )}
                       <div className="flex-1 space-y-2 py-1">
                          <span className="text-xs font-medium text-primary uppercase tracking-wider">
                            {b.category}
                          </span>
                          <h4 className="font-semibold text-slate-800 line-clamp-2 leading-snug">
                            {b.title}
                          </h4>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(b._creationTime), 'dd MMM yyyy', { locale: localeID })}
                          </span>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Side Content */}
        <div className="space-y-6">
          
          {/* Aksi Cepat */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Link to="/admin/berita/tambah">
                    <Newspaper className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-medium">Tulis Berita</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Link to="/admin/infografis/penduduk">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-medium">Warga</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Link to="/admin/infografis/bansos">
                    <Package className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-medium">Bansos</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <Link to="/admin/infografis/stunting">
                    <Activity className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-medium">Stunting</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demografi Bar */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Proporsi Gender</CardTitle>
              <CardDescription>Distribusi warga berdasarkan jenis kelamin.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                   <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${percLaki}%` }} />
                   <div className="h-full bg-rose-400 transition-all duration-1000" style={{ width: `${percPerempuan}%` }} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-slate-600 font-medium">Laki-laki</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">{percLaki}%</span>
                    <span className="text-slate-400 text-xs ml-2">({totalLaki})</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="text-slate-600 font-medium">Perempuan</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">{percPerempuan}%</span>
                    <span className="text-slate-400 text-xs ml-2">({totalPerempuan})</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Sistem */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Status Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Database className="w-4 h-4 text-slate-400" />
                    Database
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Cloud className="w-4 h-4 text-slate-400" />
                    Cloud Storage
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-medium text-slate-600">Terhubung</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-sm text-slate-500">Peran Akun Aktif</span>
                  <Badge variant="outline" className="font-medium bg-slate-50">
                    {user?.role || 'Admin'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
