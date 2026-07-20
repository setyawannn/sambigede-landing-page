import { useState } from 'react'
import { usePaginatedQuery, useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Database,
  HardDrive,
  FileImage,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Save,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react'
import { Skeleton } from '../../ui/skeleton'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { toast } from 'sonner'

// Helper to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function R2Analytics() {
  const stats = useQuery(api.r2_analytics.getR2Stats)
  const settings = useQuery(api.r2_analytics.getR2Settings)
  const saveSettingsMutation = useMutation(api.r2_analytics.saveR2Settings)

  const {
    results: logs,
    status,
    loadMore,
  } = usePaginatedQuery(api.r2_analytics.getR2Logs, {}, { initialNumItems: 10 })

  const [isSaving, setIsSaving] = useState(false)

  // Local state for settings form
  const [formData, setFormData] = useState({
    preventiveEnabled: false,
    dailyUploadLimit: 50,
    dailyBandwidthLimitMB: 100, // Show in MB
  })

  // Sync local state when settings load
  const [formInitialized, setFormInitialized] = useState(false)
  if (settings && !formInitialized) {
    setFormData({
      preventiveEnabled: settings.preventiveEnabled,
      dailyUploadLimit: settings.dailyUploadLimit,
      dailyBandwidthLimitMB: Math.round(
        settings.dailyBandwidthLimit / (1024 * 1024),
      ),
    })
    setFormInitialized(true)
  }

  if (stats === undefined || settings === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await saveSettingsMutation({
        preventiveEnabled: formData.preventiveEnabled,
        dailyUploadLimit: formData.dailyUploadLimit,
        dailyBandwidthLimit: formData.dailyBandwidthLimitMB * 1024 * 1024,
      })
      toast.success('Pengaturan kuota berhasil disimpan')
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  const bandwidthPercentage = Math.min(
    100,
    (stats.bandwidthToday / settings.dailyBandwidthLimit) * 100,
  )
  const filesPercentage = Math.min(
    100,
    (stats.uploadsToday / settings.dailyUploadLimit) * 100,
  )

  const isQuotaExceeded = bandwidthPercentage >= 100 || filesPercentage >= 100

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Analitik & Kuota Cloudflare R2
        </h1>
        <p className="text-slate-500 mt-1">
          Pantau penggunaan penyimpanan, cegah penyalahgunaan, dan atur batasan
          agar tetap menggunakan R2 Free Tier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Settings */}
        <div className="space-y-6 lg:col-span-1">
          {/* Status Keamanan */}
          <div
            className={`p-6 rounded-2xl border ${settings.preventiveEnabled ? (isQuotaExceeded ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200') : 'bg-slate-50 border-slate-200'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              {settings.preventiveEnabled ? (
                isQuotaExceeded ? (
                  <ShieldAlert className="text-red-600 w-6 h-6" />
                ) : (
                  <ShieldCheck className="text-emerald-600 w-6 h-6" />
                )
              ) : (
                <ShieldAlert className="text-amber-600 w-6 h-6" />
              )}
              <h3 className="font-bold text-slate-800">Status Proteksi</h3>
            </div>
            <p className="text-sm font-medium">
              {settings.preventiveEnabled ? (
                isQuotaExceeded ? (
                  <span className="text-red-700">
                    KUOTA HABIS - Upload Ditangguhkan
                  </span>
                ) : (
                  <span className="text-emerald-700">
                    AKTIF - Kuota Tersedia
                  </span>
                )
              ) : (
                <span className="text-amber-700">
                  TIDAK AKTIF - Tidak ada batasan
                </span>
              )}
            </p>
          </div>

          {/* Settings Form */}
          <form
            onSubmit={handleSaveSettings}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Database className="w-5 h-5 text-slate-500" /> Pengaturan Kuota
              </h3>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="preventive"
                className="text-sm text-slate-600 font-medium"
              >
                Aktifkan Proteksi Harian
              </Label>
              <button
                type="button"
                id="preventive"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    preventiveEnabled: !prev.preventiveEnabled,
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.preventiveEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.preventiveEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="uploadLimit" className="text-sm text-slate-600">
                Maks. File Harian
              </Label>
              <Input
                id="uploadLimit"
                type="number"
                min={1}
                value={formData.dailyUploadLimit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dailyUploadLimit: parseInt(e.target.value) || 0,
                  }))
                }
                disabled={!formData.preventiveEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bwLimit" className="text-sm text-slate-600">
                Maks. Bandwidth Harian (MB)
              </Label>
              <Input
                id="bwLimit"
                type="number"
                min={1}
                value={formData.dailyBandwidthLimitMB}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dailyBandwidthLimitMB: parseInt(e.target.value) || 0,
                  }))
                }
                disabled={!formData.preventiveEnabled}
              />
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}{' '}
              Simpan
            </Button>
          </form>
        </div>

        {/* Right Column: Analytics & Progress */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Bandwidth Progress */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <HardDrive className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-slate-800">
                  Trafik Data (Hari Ini)
                </h3>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-slate-800">
                  {formatBytes(stats.bandwidthToday)}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  dari {formatBytes(settings.dailyBandwidthLimit)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${bandwidthPercentage >= 100 ? 'bg-red-500' : bandwidthPercentage > 80 ? 'bg-amber-400' : 'bg-indigo-500'}`}
                  style={{ width: `${bandwidthPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {bandwidthPercentage.toFixed(1)}% terpakai
              </p>
            </div>

            {/* Today's Files Progress */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileImage className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-slate-800">
                  File Terunggah (Hari Ini)
                </h3>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-slate-800">
                  {stats.uploadsToday}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  dari {settings.dailyUploadLimit} file
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${filesPercentage >= 100 ? 'bg-red-500' : filesPercentage > 80 ? 'bg-amber-400' : 'bg-blue-500'}`}
                  style={{ width: `${filesPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {filesPercentage.toFixed(1)}% terpakai
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-sm text-slate-500 font-medium mb-1">
                Bandwidth 7 Hari Terakhir
              </p>
              <p className="text-xl font-bold text-slate-700">
                {formatBytes(stats.bandwidthThisWeek)}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-sm text-slate-500 font-medium mb-1">
                Bandwidth 30 Hari Terakhir
              </p>
              <p className="text-xl font-bold text-slate-700">
                {formatBytes(stats.bandwidthThisMonth)}
              </p>
            </div>
          </div>

          {/* Monthly Limits Free Tier Tracker */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Database className="w-5 h-5 text-fuchsia-500" />
              <h3 className="font-semibold text-slate-800">
                Status Kuota Bulanan R2 (Free Tier)
              </h3>
            </div>

            {/* Storage Progress */}
            <div>
              <div className="flex items-end justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">
                  Total Storage Aktif
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {formatBytes(stats.totalStorageBytes)}{' '}
                  <span className="text-slate-400 font-normal">/ 10 GB</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${(stats.totalStorageBytes / (10 * 1024 * 1024 * 1024)) * 100 > 90 ? 'bg-red-500' : 'bg-fuchsia-500'}`}
                  style={{
                    width: `${Math.min(100, (stats.totalStorageBytes / (10 * 1024 * 1024 * 1024)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Class A Progress */}
            <div>
              <div className="flex items-end justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">
                  Operasi Class A (Upload/Hapus)
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {stats.classACount.toLocaleString('id-ID')}{' '}
                  <span className="text-slate-400 font-normal">
                    / 1.000.000
                  </span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${(stats.classACount / 1000000) * 100 > 90 ? 'bg-red-500' : 'bg-orange-500'}`}
                  style={{
                    width: `${Math.min(100, (stats.classACount / 1000000) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Class B Progress */}
            <div>
              <div className="flex items-end justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">
                  Operasi Class B (Buka Gambar)
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {stats.classBCount.toLocaleString('id-ID')}{' '}
                  <span className="text-slate-400 font-normal">
                    / 10.000.000
                  </span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${(stats.classBCount / 10000000) * 100 > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{
                    width: `${Math.min(100, (stats.classBCount / 10000000) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {stats.circuitBreakerActive && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p>
                  <strong>Circuit Breaker Aktif!</strong> Sistem telah
                  menangguhkan akses langsung ke Cloudflare R2 untuk mencegah
                  pembebanan biaya karena limit bulanan / storage hampir habis.
                  Gambar akan diganti dengan placeholder.
                </p>
              </div>
            )}
          </div>

          {/* Logs Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800">
                Riwayat Unggahan Terakhir
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium border-b border-slate-100">
                      Waktu
                    </th>
                    <th className="px-6 py-3 font-medium border-b border-slate-100">
                      Nama File (Key)
                    </th>
                    <th className="px-6 py-3 font-medium border-b border-slate-100 text-right">
                      Ukuran
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-slate-400"
                      >
                        Belum ada file yang diunggah.
                      </td>
                    </tr>
                  ) : (
                    logs?.map((log) => (
                      <tr
                        key={log._id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-slate-600">
                          {format(
                            new Date(log.timestamp),
                            'dd MMM yyyy, HH:mm',
                            { locale: id },
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span
                              className="font-mono text-xs text-slate-600 truncate max-w-[200px] block"
                              title={log.fileKey}
                            >
                              {log.fileKey}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right text-slate-700 font-medium">
                          {formatBytes(log.fileSize)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Menampilkan {logs?.length || 0} log terbaru
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadMore(10)}
                disabled={status !== 'CanLoadMore'}
                className="h-8 text-xs px-3"
              >
                {status === 'LoadingMore' ? 'Memuat...' : 'Muat Lainnya'}{' '}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
