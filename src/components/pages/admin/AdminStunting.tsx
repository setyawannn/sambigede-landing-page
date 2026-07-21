import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useState, useRef, useMemo } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Upload,
  Download,
  FileSpreadsheet,
  Calendar as CalendarIcon,
} from 'lucide-react'
import type { Id, Doc } from '../../../../convex/_generated/dataModel'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

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
import { Badge } from '../../ui/badge'
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
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Calendar } from '../../ui/calendar'

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

function parseExcelDate(val: unknown): number {
  if (val instanceof Date) return val.getTime()
  if (typeof val === 'number' && val > 30000) {
    return new Date(Math.round((val - 25569) * 86400 * 1000)).getTime()
  }
  const d = new Date(String(val))
  if (isNaN(d.getTime())) throw new Error(`Tanggal tidak valid: ${val}`)
  return d.getTime()
}

type FormData = {
  nama: string
  nik: string
  jk: 'L' | 'P'
  namaOrtu: string
  alamat: string
  pos: string
}

const EMPTY_FORM: FormData = {
  nama: '',
  nik: '',
  jk: 'L',
  namaOrtu: '',
  alamat: '',
  pos: '',
}

export default function AdminStunting() {
  const periodeList = useQuery(api.stunting.getDistinctPeriode, {})

  const [selectedBulan, setSelectedBulan] = useState<number | undefined>(
    undefined,
  )
  const [selectedTahun, setSelectedTahun] = useState<number | undefined>(
    undefined,
  )

  const bulanQuery = selectedBulan !== undefined ? selectedBulan : undefined
  const tahunQuery = selectedTahun !== undefined ? selectedTahun : undefined

  const stunting = useQuery(api.stunting.getStunting, {
    bulan: bulanQuery,
    tahun: tahunQuery,
  })
  const deleteStunting = useMutation(api.stunting.deleteStunting)
  const createStunting = useMutation(api.stunting.createStunting)
  const updateStunting = useMutation(api.stunting.updateStunting)
  const batchInsertStunting = useMutation(api.stunting.batchInsertStunting)

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<Id<'stunting'> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Doc<'stunting'> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [tglLahirDate, setTglLahirDate] = useState<Date | undefined>(undefined)

  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importBulan, setImportBulan] = useState<number | undefined>(undefined)
  const [importTahun, setImportTahun] = useState<number | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredStunting = useMemo(() => {
    if (!stunting) return undefined
    if (!searchTerm.trim()) return stunting
    const term = searchTerm.toLowerCase()
    return stunting.filter(
      (s) =>
        s.nama.toLowerCase().includes(term) ||
        s.alamat.toLowerCase().includes(term) ||
        s.pos.toLowerCase().includes(term),
    )
  }, [stunting, searchTerm])

  const periodeOptions = useMemo(() => {
    if (!periodeList) return []
    return periodeList
  }, [periodeList])

  const selectedPeriodeLabel = useMemo(() => {
    if (
      selectedBulan === undefined ||
      selectedTahun === undefined ||
      !MONTHS[selectedBulan - 1]
    )
      return 'Semua Periode'
    return `${MONTHS[selectedBulan - 1]} ${selectedTahun}`
  }, [selectedBulan, selectedTahun])

  const handleOpenModal = (item?: Doc<'stunting'>) => {
    if (item) {
      setEditId(item._id)
      setFormData({
        nama: item.nama,
        nik: item.nik ?? '',
        jk: item.jk,
        namaOrtu: item.namaOrtu,
        alamat: item.alamat,
        pos: item.pos,
      })
      setTglLahirDate(new Date(item.tanggalLahir))
    } else {
      setEditId(null)
      setFormData(EMPTY_FORM)
      setTglLahirDate(undefined)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tglLahirDate) {
      toast.error('Tanggal lahir wajib diisi')
      return
    }
    setIsSubmitting(true)
    const payload = {
      ...formData,
      nik: formData.nik.trim() || undefined,
      tanggalLahir: tglLahirDate.getTime(),
    }
    try {
      if (editId) {
        await updateStunting({
          id: editId,
          nama: payload.nama,
          nik: payload.nik,
          tanggalLahir: payload.tanggalLahir,
          jk: payload.jk,
          namaOrtu: payload.namaOrtu,
          alamat: payload.alamat,
          pos: payload.pos,
        })
        toast.success('Data berhasil diperbarui')
      } else {
        const b = selectedBulan ?? new Date().getMonth() + 1
        const t = selectedTahun ?? new Date().getFullYear()
        await createStunting({
          ...payload,
          bulan: b,
          tahun: t,
        })
        toast.success('Data berhasil ditambahkan')
      }
      setIsModalOpen(false)
    } catch {
      toast.error('Gagal menyimpan data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteItem) return
    setIsDeleting(true)
    try {
      await deleteStunting({ id: deleteItem._id })
      toast.success('Data stunting berhasil dihapus')
      setDeleteItem(null)
    } catch {
      toast.error('Gagal menghapus data stunting')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'NAMA BALITA': 'Contoh Nama',
        NIK: '3505160101220001',
        'TANGGAL LAHIR': '01/01/2022',
        JK: 'L',
        'NAMA ORANGTUA': 'Nama Orangtua',
        ALAMAT: 'Sambigede',
        POS: 'MATAHARI 1',
      },
    ]
    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Stunting')
    XLSX.writeFile(workbook, 'Template_Stunting_Sambigede.xlsx')
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) throw new Error('File kosong')
        const data = new Uint8Array(event.target.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
        })

        if (json.length === 0) {
          toast.error('File Excel kosong atau format salah')
          return
        }

        const parsedData: {
          nama: string
          nik?: string
          tanggalLahir: number
          jk: 'L' | 'P'
          namaOrtu: string
          alamat: string
          pos: string
        }[] = []

        for (const row of json as Record<string, unknown>[]) {
          const nama = String(row['NAMA BALITA'] ?? '').trim()
          if (!nama) continue

          const nikRaw = row['NIK']
          const nik =
            nikRaw !== undefined && nikRaw !== null && String(nikRaw).trim() !== ''
              ? String(nikRaw).trim()
              : undefined

          const tanggalLahir = parseExcelDate(row['TANGGAL LAHIR'])
          const jkRaw = String(row['JK'] ?? '').trim().toUpperCase()
          const jk = jkRaw === 'L' || jkRaw === 'P' ? jkRaw : 'L'
          const namaOrtu = String(row['NAMA ORANGTUA'] ?? '').trim()
          const alamat = String(row['ALAMAT'] ?? '').trim()
          const pos = String(row['POS'] ?? '').trim()

          if (!namaOrtu || !alamat || !pos) continue

          parsedData.push({ nama, nik, tanggalLahir, jk: jk as 'L' | 'P', namaOrtu, alamat, pos })
        }

        if (parsedData.length === 0) {
          toast.error(
            'Tidak ada data valid ditemukan. Periksa kolom: NAMA BALITA, NAMA ORANGTUA, ALAMAT, POS wajib diisi.',
          )
          return
        }

        if (importBulan === undefined || importTahun === undefined) {
          toast.error('Silakan pilih Bulan dan Tahun terlebih dahulu')
          return
        }

        await batchInsertStunting({
          data: parsedData,
          bulan: importBulan,
          tahun: importTahun,
        })
        toast.success(`Berhasil mengimpor ${parsedData.length} data stunting!`)
        setIsImportOpen(false)
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

  const handleExportExcel = () => {
    if (!filteredStunting || filteredStunting.length === 0) {
      toast.error('Tidak ada data untuk diekspor')
      return
    }
    const exportData = filteredStunting.map((item, idx) => ({
      NO: idx + 1,
      'NAMA BALITA': item.nama,
      NIK: item.nik || '-',
      'TANGGAL LAHIR': format(new Date(item.tanggalLahir), 'dd/MM/yyyy', {
        locale: localeId,
      }),
      JK: item.jk,
      'NAMA ORANGTUA': item.namaOrtu,
      ALAMAT: item.alamat,
      POS: item.pos,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Stunting')

    const bulanLabel = selectedBulan ? MONTHS[selectedBulan - 1] : ''
    const tahunLabel = selectedTahun ? `_${selectedTahun}` : ''
    const fileName = bulanLabel
      ? `Data_Stunting_${bulanLabel}${tahunLabel}.xlsx`
      : 'Data_Stunting.xlsx'

    XLSX.writeFile(workbook, fileName)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Daftar Balita Stunting{selectedPeriodeLabel !== 'Semua Periode' ? ` Per ${selectedPeriodeLabel}` : ''}
          </h2>
          <p className="text-slate-500 mt-1">
            Kelola data pemantauan balita stunting.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => handleOpenModal()} className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Data
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Template
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setImportBulan(selectedBulan)
              setImportTahun(selectedTahun)
              setIsImportOpen(true)
            }}
            className="gap-2"
          >
            <Upload className="w-4 h-4 text-blue-600" /> Import
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="gap-2">
            <Download className="w-4 h-4 text-slate-600" /> Export
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Cari nama, alamat, atau pos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50"
              />
            </div>
            <Select
              value={
                selectedBulan !== undefined && selectedTahun !== undefined
                  ? `${selectedBulan}-${selectedTahun}`
                  : 'semua'
              }
              onValueChange={(val) => {
                if (val === 'semua') {
                  setSelectedBulan(undefined)
                  setSelectedTahun(undefined)
                } else {
                  const [b, t] = val.split('-').map(Number)
                  setSelectedBulan(b)
                  setSelectedTahun(t)
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Periode</SelectItem>
                {periodeOptions.map((p) => (
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
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">
                  Nama Balita
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  NIK
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Tgl Lahir
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  JK
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Orang Tua
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Alamat
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Pos
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stunting === undefined ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredStunting?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-slate-500"
                  >
                    Tidak ada data stunting.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStunting?.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="py-3 font-semibold text-slate-800">
                      {item.nama}
                    </TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {item.nik || '-'}
                    </TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {format(new Date(item.tanggalLahir), 'dd MMM yyyy', {
                        locale: localeId,
                      })}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className={
                          item.jk === 'L'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                        }
                      >
                        {item.jk === 'L' ? 'L' : 'P'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {item.namaOrtu}
                    </TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {item.alamat}
                    </TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {item.pos}
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
                          onClick={() => setDeleteItem(item)}
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
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Edit Data Balita' : 'Tambah Data Balita'}
            </DialogTitle>
            <DialogDescription>
              Lengkapi data balita untuk pemantauan stunting.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Balita</Label>
                <Input
                  id="nama"
                  required
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  placeholder="Nama lengkap balita"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nik">NIK (Opsional)</Label>
                <Input
                  id="nik"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value })
                  }
                  placeholder="Nomor Induk Kependudukan"
                />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Lahir</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !tglLahirDate ? 'text-muted-foreground' : ''
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tglLahirDate ? (
                        format(tglLahirDate, 'dd MMMM yyyy', {
                          locale: localeId,
                        })
                      ) : (
                        <span>Pilih tanggal lahir</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tglLahirDate}
                      onSelect={setTglLahirDate}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={2015}
                      toYear={2026}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jk">Jenis Kelamin</Label>
                <Select
                  value={formData.jk}
                  onValueChange={(val: 'L' | 'P') =>
                    setFormData({ ...formData, jk: val })
                  }
                >
                  <SelectTrigger id="jk">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="namaOrtu">Nama Orang Tua</Label>
                <Input
                  id="namaOrtu"
                  required
                  value={formData.namaOrtu}
                  onChange={(e) =>
                    setFormData({ ...formData, namaOrtu: e.target.value })
                  }
                  placeholder="Nama orang tua"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input
                  id="alamat"
                  required
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  placeholder="Alamat / dusun"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pos">Posyandu</Label>
                <Input
                  id="pos"
                  required
                  value={formData.pos}
                  onChange={(e) =>
                    setFormData({ ...formData, pos: e.target.value })
                  }
                  placeholder="Nama posyandu"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t mt-4">
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

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Impor Data Stunting</DialogTitle>
            <DialogDescription>
              Unggah file Excel lalu pilih Bulan dan Tahun periode data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label>File Excel</Label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isImporting}
                />
                <Button
                  variant="outline"
                  onClick={handleFileSelect}
                  className="gap-2 flex-1"
                  disabled={isImporting}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengimpor...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Pilih File Excel
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Kolom: NAMA BALITA, NIK, TANGGAL LAHIR, JK, NAMA ORANGTUA,
                ALAMAT, POS
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bulan</Label>
                <Select
                  value={importBulan?.toString() ?? ''}
                  onValueChange={(v) => setImportBulan(Number(v))}
                  disabled={isImporting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun</Label>
                <Select
                  value={importTahun?.toString() ?? ''}
                  onValueChange={(v) => setImportTahun(Number(v))}
                  disabled={isImporting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => 2022 + i).map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsImportOpen(false)}
              disabled={isImporting}
            >
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteItem !== null}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Stunting</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data stunting balita "
              {deleteItem?.nama}" akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
