import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Upload, Trash2, CheckCircle2, Circle, Loader2, FileSpreadsheet, Eye } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import type { Id } from '../../../../convex/_generated/dataModel'

import { Card, CardContent, CardHeader } from '../../ui/card'
import { Button } from '../../ui/button'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog'

export default function AdminApbdes() {
  const tahunList = useQuery(api.apbdes.getApbdesTahunList, {})
  const importBatch = useMutation(api.apbdes.importApbdesBatch)
  const setTahunActive = useMutation(api.apbdes.setActiveTahun)
  const deleteTahun = useMutation(api.apbdes.deleteApbdesTahun)

  const [isImporting, setIsImporting] = useState(false)
  const [deleteId, setDeleteId] = useState<Id<'apbdes_tahun'> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka)
  }

  // --- EXCEL PARSER LOGIC ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const data = await file.arrayBuffer()
      const wb = XLSX.read(data, { type: 'array' })
      
      // Prioritize "APBDES PERUBAHAN" if it exists, otherwise "APBDES AWAL", otherwise first sheet
      let sheetName = wb.SheetNames[0]
      if (wb.SheetNames.includes('APBDES PERUBAHAN')) sheetName = 'APBDES PERUBAHAN'
      else if (wb.SheetNames.includes('APBDES AWAL')) sheetName = 'APBDES AWAL'

      const sheet = wb.Sheets[sheetName]
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      // Extract Year and Jenis
      let tahun = new Date().getFullYear()
      let jenis: 'Awal' | 'Perubahan' = sheetName.includes('PERUBAHAN') ? 'Perubahan' : 'Awal'

      for (const row of rows.slice(0, 15)) {
        if (!row) continue
        const text = row.join(' ').toUpperCase()
        if (text.includes('TAHUN ANGGARAN')) {
          const match = text.match(/\d{4}/)
          if (match) tahun = parseInt(match[0])
        }
        if (text.includes('PERUBAHAN')) jenis = 'Perubahan'
      }

      // Parsing items
      const itemsToInsert: any[] = []
      let currentKategori: 'Pendapatan' | 'Belanja' | 'Pembiayaan' | null = null
      let currentBidang = ''

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (!row || row.length === 0) continue

        const strRow = Array.from(row).map((c) => (c ? String(c).trim() : ''))
        const joined = strRow.join(' ').toUpperCase()

        // Detect Category
        if (joined.includes('PENDAPATAN') && !joined.includes('JUMLAH')) currentKategori = 'Pendapatan'
        if (joined.includes('BELANJA') && !joined.includes('JUMLAH')) currentKategori = 'Belanja'
        if (joined.includes('PEMBIAYAAN') && !joined.includes('JUMLAH')) currentKategori = 'Pembiayaan'

        // Detect Bidang (Usually starts with "Bidang")
        if (currentKategori === 'Belanja' && joined.includes('BIDANG ') && !joined.includes('SUB BIDANG') && !joined.includes('SUB.')) {
          currentBidang = strRow.find((s) => s && s.toUpperCase().includes('BIDANG')) || ''
        }

        // Try to extract an item row
        // Based on typical SISKEUDES:
        // Index with numbers/dots is Kode Rekening. Uraian is usually text. Anggaran is a number.
        // E.g., [ "1", "1.1", "Siltap", 50000000, 50000000, "ADD" ]
        let uraian = ''
        let anggaranSemula = 0
        let anggaranMenjadi = 0
        let sumberDana = ''

        // Heuristic: Find first text that isn't just numbers/dots for Uraian
        let textIndex = -1
        for (let j = 0; j < strRow.length; j++) {
          const s = strRow[j]
          // Must be a string longer than 3 chars, contain letters, and not be a common header
          if (
            s.length > 3 &&
            /[a-zA-Z]{3,}/.test(s) &&
            !['KODE REKENING', 'URAIAN', 'ANGGARAN', 'JUMLAH'].some((x) => s.toUpperCase().includes(x))
          ) {
            uraian = s
            textIndex = j
            break
          }
        }

        if (textIndex !== -1) {
          // Find budgets which are numbers appearing AFTER the text description
          const budgets: number[] = []
          for (let j = textIndex + 1; j < row.length; j++) {
            if (typeof row[j] === 'number') {
              budgets.push(row[j])
            }
          }

          if (budgets.length > 0) {
            if (jenis === 'Perubahan' && budgets.length >= 2) {
              anggaranSemula = budgets[0]
              anggaranMenjadi = budgets[1]
            } else {
              anggaranMenjadi = budgets[0]
              anggaranSemula = budgets[0]
            }

            // Find sumber dana (short text like DD, ADD, PAD, PBH, SILPA) after textIndex
            for (let j = textIndex + 1; j < strRow.length; j++) {
              const s = strRow[j].toUpperCase()
              if (['DD', 'DDS', 'ADD', 'PAD', 'PBH', 'SILPA', 'DLL'].some(k => s.includes(k))) {
                sumberDana = s
                break
              }
            }

            // Only insert if it looks like a valid item
            if (uraian && anggaranMenjadi > 0 && currentKategori) {
               // Avoid inserting "JUMLAH" or "TOTAL"
               if (!uraian.toUpperCase().includes('JUMLAH') && !uraian.toUpperCase().includes('SURPLUS') && !uraian.toUpperCase().includes('DEFISIT')) {
                 itemsToInsert.push({
                   kategori: currentKategori,
                   bidang: currentBidang || undefined,
                   uraian,
                   anggaranSemula: anggaranSemula || undefined,
                   anggaranMenjadi,
                   realisasi: anggaranMenjadi, // Default realisasi to anggaran for now
                   sumberDana: sumberDana || undefined
                 })
               }
            }
          }
        }
      }

      if (itemsToInsert.length === 0) {
        toast.error('Gagal menemukan data rincian di file Excel. Pastikan format kolom berisi Uraian dan Anggaran angka.')
        setIsImporting(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      // Calculate totals
      const totalPendapatan = itemsToInsert.filter(i => i.kategori === 'Pendapatan').reduce((a, b) => a + (b.anggaranMenjadi || 0), 0)
      const totalPendapatanSemula = itemsToInsert.filter(i => i.kategori === 'Pendapatan').reduce((a, b) => a + (b.anggaranSemula || 0), 0)
      const totalBelanja = itemsToInsert.filter(i => i.kategori === 'Belanja').reduce((a, b) => a + (b.anggaranMenjadi || 0), 0)
      const totalBelanjaSemula = itemsToInsert.filter(i => i.kategori === 'Belanja').reduce((a, b) => a + (b.anggaranSemula || 0), 0)
      const pembiayaanNetto = itemsToInsert.filter(i => i.kategori === 'Pembiayaan').reduce((a, b) => a + (b.anggaranMenjadi || 0), 0)

      // Send to backend
      await importBatch({
        tahunData: {
          tahun,
          jenis,
          totalPendapatanSemula,
          totalPendapatan,
          totalBelanjaSemula,
          totalBelanja,
          pembiayaanNetto,
          status: 'Arsip' // Import as Arsip by default, let admin activate it
        },
        items: itemsToInsert
      })

      toast.success(`Berhasil mengimpor ${itemsToInsert.length} rincian untuk Tahun ${tahun} (${jenis})!`)
    } catch (error: any) {
      toast.error('Terjadi kesalahan saat memproses Excel: ' + error.message)
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteTahun = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteTahun({ id: deleteId })
      toast.success('Data tahun APBDes berhasil dihapus')
      setDeleteId(null)
    } catch (error: any) {
      toast.error('Gagal menghapus: ' + error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSetActive = async (id: Id<'apbdes_tahun'>) => {
    try {
      await setTahunActive({ id })
      toast.success('Tahun aktif berhasil diubah')
    } catch (error: any) {
      toast.error('Gagal mengubah status: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Keuangan APBDes
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data laporan APBDes dengan mudah via fitur Import Excel otomatis.
          </p>
        </div>
        <div>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isImporting}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            {isImporting ? 'Memproses Excel...' : 'Import Excel (.xlsx)'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            Daftar Laporan APBDes Tahunan
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tahun</TableHead>
                <TableHead>Jenis Anggaran</TableHead>
                <TableHead>Total Pendapatan</TableHead>
                <TableHead>Total Belanja</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!tahunList ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                  </TableCell>
                </TableRow>
              ) : tahunList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-500">
                    Belum ada data APBDes. Silakan gunakan fitur Import Excel.
                  </TableCell>
                </TableRow>
              ) : (
                tahunList.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="font-bold text-slate-800">{t.tahun}</TableCell>
                    <TableCell>{t.jenis}</TableCell>
                    <TableCell className="text-emerald-600 font-medium">{formatRupiah(t.totalPendapatan)}</TableCell>
                    <TableCell className="text-red-600 font-medium">{formatRupiah(t.totalBelanja)}</TableCell>
                    <TableCell>
                      {t.status === 'Aktif' ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 flex items-center gap-1.5 w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-500 flex items-center gap-1.5 w-fit">
                          <Circle className="w-3.5 h-3.5" /> Arsip
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {t.status !== 'Aktif' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetActive(t._id)}
                            className="text-xs"
                          >
                            Set Aktif
                          </Button>
                        )}
                        <Link
                          to="/admin/infografis/apbdes_/$tahunId"
                          params={{ tahunId: t._id }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Lihat Rincian"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(t._id)}
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data APBDes?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus laporan tahunan ini beserta <strong>seluruh rincian kegiatannya</strong>. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTahun}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
