import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useState, useRef, useMemo } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Download,
  Upload,
  FileSpreadsheet,
  Trash,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Id, Doc } from '../../../../convex/_generated/dataModel'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'

import { Card, CardContent, CardHeader } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { Badge } from '../../ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { Skeleton } from '../../ui/skeleton'
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

export default function AdminBansos() {
  const bansos = useQuery(api.bansos.getBansos, {})
  const deleteBansos = useMutation(api.bansos.deleteBansos)
  const createBansos = useMutation(api.bansos.createBansos)
  const updateBansos = useMutation(api.bansos.updateBansos)
  const batchInsertBansos = useMutation(api.bansos.batchInsertBansos)
  const clearBansos = useMutation(api.bansos.clearBansos)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterJenis, setFilterJenis] = useState('Semua')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<Id<'bansos'> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [deleteItem, setDeleteItem] = useState<Doc<'bansos'> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false)
  const [isClearingAll, setIsClearingAll] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    alamat: '',
    jenisBansos: 'PKH',
  })

  const filteredBansos = useMemo(() => {
    if (!bansos) return []
    return bansos.filter((b) => {
      const q = searchTerm.toLowerCase()
      const matchSearch =
        b.nama.toLowerCase().includes(q) ||
        (b.nik && b.nik.toLowerCase().includes(q)) ||
        b.alamat.toLowerCase().includes(q)
      const matchJenis =
        filterJenis === 'Semua' || b.jenisBansos === filterJenis
      return matchSearch && matchJenis
    })
  }, [bansos, searchTerm, filterJenis])

  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, filterJenis])

  const totalItems = filteredBansos.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  const paginatedBansos = filteredBansos.slice(startItem - 1, endItem)

  const handleOpenModal = (item?: Doc<'bansos'>) => {
    if (item) {
      setEditId(item._id)
      setFormData({
        nama: item.nama,
        nik: item.nik || '',
        alamat: item.alamat,
        jenisBansos: item.jenisBansos,
      })
    } else {
      setEditId(null)
      setFormData({
        nama: '',
        nik: '',
        alamat: '',
        jenisBansos: 'PKH',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        nama: formData.nama,
        nik: formData.nik.trim() === '' ? undefined : formData.nik,
        alamat: formData.alamat,
        jenisBansos: formData.jenisBansos,
      }
      if (editId) {
        await updateBansos({ id: editId, ...payload })
        toast.success('Data bansos diperbarui')
      } else {
        await createBansos(payload)
        toast.success('Data bansos ditambahkan')
      }
      setIsModalOpen(false)
    } catch (err) {
      toast.error('Terjadi kesalahan saat menyimpan data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (item: Doc<'bansos'>) => {
    setDeleteItem(item)
  }

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Nama Penerima': 'Ahmad Subekti',
        'NIK (Opsional)': '3505010101850001',
        Alamat: 'RT 001 / RW 001, Dusun Sambigede',
        'Jenis Bantuan': 'PKH',
      },
      {
        'Nama Penerima': 'Siti Rahayu',
        'NIK (Opsional)': '',
        Alamat: 'RT 002 / RW 001, Dusun Paldoyong',
        'Jenis Bantuan': 'BPNT',
      },
    ]
    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Bansos')
    XLSX.writeFile(workbook, 'Template_Bansos_Sambigede.xlsx')
    toast.success('Template berhasil diunduh')
  }

  const handleExportExcel = () => {
    if (filteredBansos.length === 0) {
      toast.error('Tidak ada data untuk diekspor')
      return
    }
    const exportData = filteredBansos.map((b) => ({
      'Nama Penerima': b.nama,
      'NIK (Opsional)': b.nik || '-',
      Alamat: b.alamat,
      'Jenis Bantuan': b.jenisBansos,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Bansos')
    XLSX.writeFile(workbook, 'Data_Bansos_Sambigede.xlsx')
    toast.success('Data berhasil diekspor')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) throw new Error('File empty')
        const data = new Uint8Array(event.target.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)

        const parsedData = json
          .map((row: any) => ({
            nama: String(row['Nama Penerima'] || ''),
            nik: row['NIK (Opsional)']
              ? String(row['NIK (Opsional)'])
              : undefined,
            alamat: String(row['Alamat'] || ''),
            jenisBansos: String(row['Jenis Bantuan'] || 'Lainnya'),
          }))
          .filter(
            (item) => item.nama.trim() !== '' && item.alamat.trim() !== '',
          )

        if (parsedData.length === 0) {
          toast.error('Gagal impor: File kosong atau format salah.')
        } else {
          await batchInsertBansos({ data: parsedData })
          toast.success(`Berhasil mengimpor ${parsedData.length} data bansos!`)
        }
      } catch (err) {
        console.error(err)
        toast.error('Gagal mengimpor Excel. Pastikan format sesuai template.')
      } finally {
        setIsImporting(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleClearAll = async () => {
    setIsClearingAll(true)
    try {
      await clearBansos()
      toast.success('Semua data bansos berhasil dihapus')
      setIsClearAllModalOpen(false)
    } catch (err) {
      toast.error('Gagal menghapus data')
    } finally {
      setIsClearingAll(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Kelola Penerima Bansos
          </h2>
          <p className="text-slate-500 mt-1">
            Manajemen data penerima bantuan sosial masyarakat.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="gap-2"
            title="Unduh Template Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Template
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              id="import-excel"
              disabled={isImporting}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              disabled={isImporting}
            >
              {isImporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 text-blue-600" />
              )}{' '}
              Import
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="gap-2"
          >
            <Download className="w-4 h-4 text-slate-600" /> Export
          </Button>
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Baru
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4 border-b flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari nama, alamat atau NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50"
            />
          </div>
          <div className="relative w-full md:w-64">
            <PackageOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full h-10 appearance-none pl-9 pr-8 bg-slate-50 border border-slate-200 focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 rounded-md outline-none transition-all text-sm font-medium text-slate-700"
            >
              <option value="Semua">Semua Bansos</option>
              <option value="PKH">PKH</option>
              <option value="BPNT">BPNT</option>
              <option value="BLT Dana Desa">BLT Dana Desa</option>
              <option value="Bantuan Dana Pangan">Bantuan Dana Pangan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 w-[200px]">
                  Nama / NIK
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Alamat Lengkap
                </TableHead>
                <TableHead className="font-semibold text-slate-700 w-[150px]">
                  Jenis Bantuan
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700 w-[120px]">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bansos === undefined ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredBansos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-slate-500"
                  >
                    Tidak ada data bansos yang cocok.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBansos.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="py-3">
                      <p className="font-medium text-slate-800">{item.nama}</p>
                      <p className="font-mono text-slate-500 text-xs mt-0.5">
                        {item.nik || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {item.alamat}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        {item.jenisBansos}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(item)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {bansos !== undefined && bansos.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-500">
                Menampilkan{' '}
                <span className="font-medium text-slate-700">{startItem}</span>{' '}
                sampai{' '}
                <span className="font-medium text-slate-700">{endItem}</span>{' '}
                dari{' '}
                <span className="font-medium text-slate-700">{totalItems}</span>{' '}
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
                      <SelectItem value="100">100</SelectItem>
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
                        variant={currentPage === page ? 'default' : 'outline'}
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    title="Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {bansos !== undefined && bansos.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsClearAllModalOpen(true)}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash className="w-4 h-4 mr-2" /> Hapus Semua Data Bansos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Edit Penerima Bansos' : 'Tambah Penerima Bansos'}
            </DialogTitle>
            <DialogDescription>
              Isi data penerima bantuan sosial secara lengkap pada formulir di
              bawah ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama Penerima <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                required
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Nama Lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nik">
                NIK{' '}
                <span className="text-slate-400 font-normal text-xs">
                  (Opsional)
                </span>
              </Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={(e) =>
                  setFormData({ ...formData, nik: e.target.value })
                }
                placeholder="3505xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat">
                Alamat Lengkap <span className="text-red-500">*</span>
              </Label>
              <Input
                id="alamat"
                required
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
                placeholder="Misal: RT 001 / RW 002, Dusun Paldoyong"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenisBansos">
                Jenis Bantuan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.jenisBansos}
                onValueChange={(val: string) =>
                  setFormData({ ...formData, jenisBansos: val })
                }
              >
                <SelectTrigger id="jenisBansos">
                  <SelectValue placeholder="Pilih Jenis Bantuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PKH">PKH</SelectItem>
                  <SelectItem value="BPNT">BPNT</SelectItem>
                  <SelectItem value="BLT Dana Desa">BLT Dana Desa</SelectItem>
                  <SelectItem value="Bantuan Dana Pangan">
                    Bantuan Dana Pangan
                  </SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 border-t mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Data'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteItem !== null}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Bansos</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data penerima "
              <span className="font-semibold text-slate-800">
                {deleteItem?.nama}
              </span>
              " akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async (e) => {
                e.preventDefault()
                if (!deleteItem) return
                setIsDeleting(true)
                try {
                  await deleteBansos({ id: deleteItem._id })
                  toast.success('Data bansos berhasil dihapus')
                  setDeleteItem(null)
                } catch (error) {
                  console.error('Gagal menghapus data', error)
                  toast.error('Gagal menghapus data bansos')
                } finally {
                  setIsDeleting(false)
                }
              }}
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isClearAllModalOpen}
        onOpenChange={setIsClearAllModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Seluruh Data Bansos?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini{' '}
              <strong className="text-red-500">sangat berbahaya</strong> dan
              tidak dapat dibatalkan. Seluruh data penerima bansos (
              {bansos?.length} entri) di dalam sistem akan dihapus permanen.
              Gunakan fitur ini hanya jika Anda ingin mereset data sebelum
              melakukan import baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearingAll}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isClearingAll}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={(e) => {
                e.preventDefault()
                handleClearAll()
              }}
            >
              {isClearingAll ? 'Menghapus Semua...' : 'Ya, Hapus Semua Data'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
