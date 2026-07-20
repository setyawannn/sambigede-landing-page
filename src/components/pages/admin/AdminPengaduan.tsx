import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useAuth } from '../../../lib/auth'
import { toast } from 'sonner'
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { id } from 'date-fns/locale'
import * as XLSX from 'xlsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Skeleton } from '../../ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Calendar } from '../../ui/calendar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog'
import {
  ShieldAlert,
  Trash2,
  MessageSquare,
  History,
  User,
  Clock,
  AlertTriangle,
  ListFilter,
  CalendarIcon,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Id } from '../../../../convex/_generated/dataModel'
import type { DateRange } from 'react-day-picker'
import { cn } from '../../../lib/utils'

export default function AdminPengaduan() {
  const { user } = useAuth()

  const pengaduanList = useQuery(api.pengaduan.getPengaduanList)
  const auditLogs = useQuery(api.pengaduan.getAuditLogs)

  const deletePengaduan = useMutation(api.pengaduan.deletePengaduan)

  const [activeTab, setActiveTab] = useState<'laporan' | 'audit'>('laporan')

  // States for deleting pengaduan
  const [deleteId, setDeleteId] = useState<Id<'pengaduan'> | null>(null)

  // States for Date Filter (Pengaduan List)
  const [date, setDate] = useState<DateRange | undefined>()

  // States for Pagination (Pengaduan List)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // States for Pagination (Audit Logs)
  const [logCurrentPage, setLogCurrentPage] = useState(1)
  const [logItemsPerPage, setLogItemsPerPage] = useState(10)

  const handleDelete = async () => {
    if (!user || !deleteId) return
    try {
      await deletePengaduan({
        id: deleteId,
        adminUser: { username: user.username, nama: user.nama },
      })
      toast.success('Laporan pengaduan berhasil dihapus!')
    } catch (error) {
      console.error(error)
      toast.error('Gagal menghapus laporan pengaduan.')
    } finally {
      setDeleteId(null)
    }
  }

  // Filter pengaduanList based on date range
  const filteredPengaduan = useMemo(() => {
    if (!pengaduanList) return []
    if (!date?.from) return pengaduanList

    return pengaduanList.filter((p) => {
      const pDate = new Date(p._creationTime)
      const start = startOfDay(date.from!)
      const end = date.to ? endOfDay(date.to) : endOfDay(date.from!)
      return isWithinInterval(pDate, { start, end })
    })
  }, [pengaduanList, date])

  useEffect(() => {
    setCurrentPage(1)
  }, [date])

  // Pengaduan Pagination Logic
  const totalItems = filteredPengaduan?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const currentPengaduan = useMemo(() => {
    if (!filteredPengaduan) return []
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPengaduan.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPengaduan, currentPage, itemsPerPage])

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Export to Excel handler
  const handleExportExcel = () => {
    if (!filteredPengaduan || filteredPengaduan.length === 0) {
      toast.error('Tidak ada data untuk diekspor!')
      return
    }

    const exportData = filteredPengaduan.map((item, index) => ({
      'No.': index + 1,
      'Tanggal Laporan': format(
        new Date(item._creationTime),
        'dd MMM yyyy, HH:mm',
        { locale: id },
      ),
      'Nama Lengkap': item.namaLengkap,
      'Alamat Email / Telepon': item.emailOrPhone,
      'Kategori Laporan': item.kategoriNama,
      'Detail Pesan': item.detailPesan,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Set column widths for better layout
    worksheet['!cols'] = [
      { wch: 5 }, // No
      { wch: 25 }, // Tanggal
      { wch: 25 }, // Nama
      { wch: 30 }, // Email/Telp
      { wch: 30 }, // Kategori
      { wch: 60 }, // Detail Pesan
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Laporan')

    const dateStr = format(new Date(), 'yyyyMMdd_HHmmss')
    XLSX.writeFile(workbook, `Laporan_Pengaduan_Sambigede_${dateStr}.xlsx`)
    toast.success('Data berhasil diekspor ke Excel!')
  }

  // Audit Logs Pagination Logic
  const totalLogItems = auditLogs?.length || 0
  const logTotalPages = Math.ceil(totalLogItems / logItemsPerPage)

  const currentLogs = useMemo(() => {
    if (!auditLogs) return []
    const startIndex = (logCurrentPage - 1) * logItemsPerPage
    return auditLogs.slice(startIndex, startIndex + logItemsPerPage)
  }, [auditLogs, logCurrentPage, logItemsPerPage])

  const logStartItem =
    totalLogItems === 0 ? 0 : (logCurrentPage - 1) * logItemsPerPage + 1
  const logEndItem = Math.min(logCurrentPage * logItemsPerPage, totalLogItems)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Laporan Masyarakat
        </h2>
        <p className="text-slate-500 mt-1">
          Pusat pengelolaan laporan, saran, dan pengaduan masyarakat.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'laporan', label: 'Daftar Laporan' },
          { id: 'audit', label: 'Log Aktivitas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'laporan' | 'audit')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'laporan' && (
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle>Daftar Laporan Masuk</CardTitle>
                <CardDescription>
                  Lihat dan kelola laporan satu arah dari masyarakat
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        'w-full sm:w-[260px] justify-start text-left font-normal bg-white',
                        !date && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, 'dd MMM yyyy', { locale: id })} -{' '}
                            {format(date.to, 'dd MMM yyyy', { locale: id })}
                          </>
                        ) : (
                          format(date.from, 'dd MMM yyyy', { locale: id })
                        )
                      ) : (
                        <span>Filter Rentang Tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                    <div className="p-3 border-t flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDate(undefined)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Bersihkan
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  onClick={handleExportExcel}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  disabled={
                    !filteredPengaduan || filteredPengaduan.length === 0
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pengaduanList === undefined ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : filteredPengaduan.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <ShieldAlert className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p>
                    Belum ada laporan pengaduan masyarakat untuk filter
                    tersebut.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPengaduan.map((p) => (
                    <div
                      key={p._id}
                      className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className="text-slate-600 bg-slate-50"
                            >
                              {p.kategoriNama}
                            </Badge>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(
                                new Date(p._creationTime),
                                'dd MMM yyyy, HH:mm',
                                { locale: id },
                              )}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg text-slate-900">
                              {p.namaLengkap}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {p.emailOrPhone}
                            </p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm border border-slate-100 whitespace-pre-wrap">
                            {p.detailPesan}
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(p._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 md:flex-none"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalItems > 0 && (
                <div className="mt-6 p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-xl">
                  <div className="text-sm text-slate-500">
                    Menampilkan{' '}
                    <span className="font-medium text-slate-700">
                      {startItem}
                    </span>{' '}
                    sampai{' '}
                    <span className="font-medium text-slate-700">
                      {endItem}
                    </span>{' '}
                    dari{' '}
                    <span className="font-medium text-slate-700">
                      {totalItems}
                    </span>{' '}
                    data
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>Baris per halaman:</span>
                      <Select
                        value={String(itemsPerPage)}
                        onValueChange={(val) => {
                          setItemsPerPage(Number(val))
                          setCurrentPage(1)
                        }}
                      >
                        <SelectTrigger className="w-16 h-8 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        title="Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1
                        if (
                          totalPages > 5 &&
                          page !== 1 &&
                          page !== totalPages &&
                          Math.abs(page - currentPage) > 1
                        ) {
                          if (page === 2 || page === totalPages - 1) {
                            return (
                              <span key={page} className="px-1 text-slate-400">
                                ...
                              </span>
                            )
                          }
                          return null
                        }

                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? 'default' : 'outline'
                            }
                            className={`w-8 h-8 p-0 ${currentPage === page ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        )
                      })}

                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                        title="Selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Aktivitas Admin (Audit Logs)</CardTitle>
              <CardDescription>
                Rekam jejak perubahan data pada tabel pengaduan dan master
                kategori
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {auditLogs === undefined ? (
                <div className="space-y-4 p-6">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : currentLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <History className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p>Belum ada riwayat aktivitas.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                      <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
                        <tr>
                          <th className="px-6 py-4">Waktu</th>
                          <th className="px-6 py-4">Admin</th>
                          <th className="px-6 py-4">Aksi</th>
                          <th className="px-6 py-4">Tabel</th>
                          <th className="px-6 py-4">Detail Perubahan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentLogs.map((log) => (
                          <tr
                            key={log._id}
                            className="border-b hover:bg-slate-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              {format(
                                new Date(log.timestamp),
                                'dd MMM yyyy, HH:mm:ss',
                                { locale: id },
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />{' '}
                                {log.adminNama}
                              </div>
                              <div className="text-xs text-slate-400">
                                @{log.adminUsername}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                variant={
                                  log.action === 'DELETE'
                                    ? 'destructive'
                                    : log.action === 'UPDATE'
                                      ? 'default'
                                      : 'secondary'
                                }
                              >
                                {log.action}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">
                              {log.tableName}
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-sm max-h-24 overflow-y-auto text-xs bg-slate-100 p-2 rounded-md border">
                                {log.action === 'UPDATE' &&
                                  log.oldValue &&
                                  log.newValue && (
                                    <div className="space-y-1">
                                      <div className="text-red-600 line-through">
                                        Lama: {log.oldValue}
                                      </div>
                                      <div className="text-green-600">
                                        Baru: {log.newValue}
                                      </div>
                                    </div>
                                  )}
                                {log.action === 'DELETE' && log.oldValue && (
                                  <div className="text-red-600">
                                    Data dihapus: {log.oldValue}
                                  </div>
                                )}
                                {log.action === 'INSERT' && log.newValue && (
                                  <div className="text-green-600">
                                    Data baru: {log.newValue}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalLogItems > 0 && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-slate-500">
                        Menampilkan{' '}
                        <span className="font-medium text-slate-700">
                          {logStartItem}
                        </span>{' '}
                        sampai{' '}
                        <span className="font-medium text-slate-700">
                          {logEndItem}
                        </span>{' '}
                        dari{' '}
                        <span className="font-medium text-slate-700">
                          {totalLogItems}
                        </span>{' '}
                        data
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span>Baris per halaman:</span>
                          <Select
                            value={String(logItemsPerPage)}
                            onValueChange={(val) => {
                              setLogItemsPerPage(Number(val))
                              setLogCurrentPage(1)
                            }}
                          >
                            <SelectTrigger className="w-16 h-8 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() =>
                              setLogCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={logCurrentPage === 1}
                            title="Sebelumnya"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>

                          {Array.from({ length: logTotalPages }).map((_, i) => {
                            const page = i + 1
                            if (
                              logTotalPages > 5 &&
                              page !== 1 &&
                              page !== logTotalPages &&
                              Math.abs(page - logCurrentPage) > 1
                            ) {
                              if (page === 2 || page === logTotalPages - 1) {
                                return (
                                  <span
                                    key={page}
                                    className="px-1 text-slate-400"
                                  >
                                    ...
                                  </span>
                                )
                              }
                              return null
                            }

                            return (
                              <Button
                                key={page}
                                variant={
                                  logCurrentPage === page
                                    ? 'default'
                                    : 'outline'
                                }
                                className={`w-8 h-8 p-0 ${logCurrentPage === page ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                                onClick={() => setLogCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            )
                          })}

                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() =>
                              setLogCurrentPage((prev) =>
                                Math.min(prev + 1, logTotalPages),
                              )
                            }
                            disabled={
                              logCurrentPage === logTotalPages ||
                              logTotalPages === 0
                            }
                            title="Selanjutnya"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Alert */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Konfirmasi Penghapusan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus laporan ini? Aksi ini akan
              dicatat ke dalam log sistem dan tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
