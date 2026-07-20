import { usePaginatedQuery, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Activity,
  LogIn,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  AlertCircle,
} from 'lucide-react'
import { Skeleton } from '../../ui/skeleton'
import { Button } from '../../ui/button'

export default function TurnstileAnalytics() {
  const stats = useQuery(api.analytics.getTurnstileStats)
  const {
    results: logs,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.analytics.getTurnstileLogs,
    {},
    { initialNumItems: 10 },
  )

  if (stats === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  const getStatusConfig = () => {
    switch (stats.securityStatus) {
      case 'Aman':
        return {
          icon: ShieldCheck,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
        }
      case 'Waspada':
        return {
          icon: ShieldAlert,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
        }
      case 'Bahaya':
        return {
          icon: ShieldX,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        }
      default:
        return {
          icon: ShieldCheck,
          color: 'text-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Keamanan & Analitik Turnstile
        </h1>
        <p className="text-slate-500 mt-1">
          Pantau lalu lintas dan deteksi serangan bot pada form publik desa.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`p-6 rounded-2xl border ${statusConfig.border} ${statusConfig.bg} flex flex-col justify-between`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Status Keamanan
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${statusConfig.color}`}>
                {stats.securityStatus}
              </h3>
            </div>
            <div
              className={`p-3 rounded-full bg-white ${statusConfig.color} shadow-sm`}
            >
              <StatusIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Berdasarkan 15 menit terakhir
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Tingkat Kelulusan
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {stats.successRate}%
              </h3>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Tingkat keberhasilan vs blokir
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Permintaan
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {stats.totalLogs}
              </h3>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <LogIn className="w-3 h-3" /> {stats.loginPercentage}%
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                <MessageSquare className="w-3 h-3" />{' '}
                {stats.pengaduanPercentage}%
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Volume total requests tersimpan
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Tindakan Diblokir
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {stats.totalBlocked}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-red-50 text-red-600">
              <ShieldX className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Robot/Spam yang dihentikan
          </p>
        </div>
      </div>

      {/* Suspicious Activity Alerts */}
      {stats.suspiciousActivities.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-red-700 font-semibold mb-4">
            <AlertCircle className="w-6 h-6" />
            <h3>Deteksi Aktivitas Mencurigakan (Spam/Brute-force)</h3>
          </div>
          <div className="space-y-3">
            {stats.suspiciousActivities.map((act, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-red-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-slate-400" />
                  <span className="font-mono text-sm text-slate-700">
                    {act.visitorId}
                  </span>
                </div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                  Gagal {act.failureCount} kali
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-600 mt-4">
            Peringatan: Beberapa perangkat pengguna mengalami kegagalan
            verifikasi terus-menerus dalam 15 menit terakhir.
          </p>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">
            Riwayat Verifikasi Terbaru
          </h3>
          <p className="text-sm text-slate-500">
            Menampilkan hasil pengecekan Turnstile pada form login dan kontak
            pengaduan.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold border-b border-slate-200">
                  Waktu
                </th>
                <th className="px-6 py-4 font-semibold border-b border-slate-200">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold border-b border-slate-200">
                  Aksi
                </th>
                <th className="px-6 py-4 font-semibold border-b border-slate-200">
                  ID Pengunjung
                </th>
                <th className="px-6 py-4 font-semibold border-b border-slate-200">
                  Pesan Error
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Belum ada riwayat aktivitas Turnstile
                  </td>
                </tr>
              ) : (
                logs?.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                      {format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm', {
                        locale: id,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.success ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5" /> Sukses
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-700">
                          <ShieldX className="w-3.5 h-3.5" /> Diblokir
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-slate-700 font-medium">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-slate-400" />
                        <span
                          className="font-mono text-xs text-slate-500 truncate max-w-[120px] block"
                          title={log.visitorId}
                        >
                          {log.visitorId.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {!log.success && log.errorMessage ? (
                        <span className="text-red-600 font-mono bg-red-50 px-2 py-1 rounded">
                          {log.errorMessage}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Menampilkan {logs?.length || 0} log terbaru
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadMore(10)}
            disabled={status !== 'CanLoadMore'}
            className="flex items-center gap-2"
          >
            {status === 'LoadingMore' ? 'Memuat...' : 'Muat Lebih Banyak'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
