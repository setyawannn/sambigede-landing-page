import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useNavigate } from '@tanstack/react-router'
import {
  Save,
  ArrowLeft,
  Loader2,
  Landmark,
  Plus,
  Trash2,
  Pencil as Edit,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { ImageUpload } from '../../ui/ImageUpload'
import { deleteFileFromR2 } from '../../../lib/r2'
import type { Id, Doc } from '../../../../convex/_generated/dataModel'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { Skeleton } from '../../ui/skeleton'

interface AdminKelembagaanKelolaProps {
  lembagaId: Id<'kelembagaan'>
  initialData: Doc<'kelembagaan'>
}

export default function AdminKelembagaanKelola({
  lembagaId,
  initialData,
}: AdminKelembagaanKelolaProps) {
  const navigate = useNavigate()

  // Lembaga Mutations
  const updateKelembagaan = useMutation(api.kelembagaan.updateKelembagaan)

  // Pengurus Queries & Mutations
  const pengurusList = useQuery(api.kelembagaan.getPengurusByKelembagaan, {
    kelembagaanId: lembagaId,
  })
  const createPengurus = useMutation(api.kelembagaan.createPengurus)
  const updatePengurus = useMutation(api.kelembagaan.updatePengurus)
  const deletePengurus = useMutation(api.kelembagaan.deletePengurus)

  // Lembaga Form State
  const [isSubmittingLembaga, setIsSubmittingLembaga] = useState(false)
  const [originalLogoKey, setOriginalLogoKey] = useState<string | undefined>(
    initialData.logoKey,
  )
  const [lembagaForm, setLembagaForm] = useState({
    nama: initialData.nama,
    singkatan: initialData.singkatan,
    deskripsi: initialData.deskripsi || '',
    logoUrl: initialData.logoUrl || '',
    logoKey: initialData.logoKey,
  })

  // Pengurus Form State
  const [isSubmittingPengurus, setIsSubmittingPengurus] = useState(false)
  const [editPengurusId, setEditPengurusId] =
    useState<Id<'pengurus_kelembagaan'> | null>(null)
  const [pengurusForm, setPengurusForm] = useState({
    nama: '',
    jabatan: '',
    urutan: 1,
  })

  // Update default urutan when list loads and not editing
  useEffect(() => {
    if (!editPengurusId && pengurusList && pengurusList.length > 0) {
      setPengurusForm((prev) => ({ ...prev, urutan: pengurusList.length + 1 }))
    }
  }, [pengurusList, editPengurusId])

  // --- Handlers for Lembaga ---
  const handleSaveLembaga = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lembagaForm.nama || !lembagaForm.singkatan) {
      toast.error('Nama dan Singkatan wajib diisi!')
      return
    }

    setIsSubmittingLembaga(true)
    try {
      if (originalLogoKey && originalLogoKey !== lembagaForm.logoKey) {
        try {
          await deleteFileFromR2({ data: { fileKey: originalLogoKey } })
        } catch (err) {
          console.error('Gagal hapus logo lama', err)
        }
      }

      await updateKelembagaan({ id: lembagaId, ...lembagaForm })
      setOriginalLogoKey(lembagaForm.logoKey)
      toast.success('Profil lembaga berhasil diperbarui!')
    } catch (error: any) {
      toast.error('Gagal memperbarui profil lembaga.')
    } finally {
      setIsSubmittingLembaga(false)
    }
  }

  // --- Handlers for Pengurus ---
  const handleSavePengurus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pengurusForm.nama || !pengurusForm.jabatan) return

    setIsSubmittingPengurus(true)
    try {
      if (editPengurusId) {
        await updatePengurus({ id: editPengurusId, ...pengurusForm })
        toast.success('Data pengurus diperbarui.')
      } else {
        await createPengurus({ kelembagaanId: lembagaId, ...pengurusForm })
        toast.success('Pengurus baru ditambahkan.')
      }
      cancelEditPengurus()
    } catch (error) {
      toast.error('Gagal menyimpan data pengurus.')
    } finally {
      setIsSubmittingPengurus(false)
    }
  }

  const handleEditPengurus = (item: Doc<'pengurus_kelembagaan'>) => {
    setEditPengurusId(item._id)
    setPengurusForm({
      nama: item.nama,
      jabatan: item.jabatan,
      urutan: item.urutan,
    })
  }

  const cancelEditPengurus = () => {
    setEditPengurusId(null)
    setPengurusForm({
      nama: '',
      jabatan: '',
      urutan: (pengurusList?.length || 0) + 1,
    })
  }

  const handleDeletePengurus = async (id: Id<'pengurus_kelembagaan'>) => {
    if (confirm('Hapus pengurus ini?')) {
      try {
        await deletePengurus({ id })
        toast.success('Pengurus dihapus.')
        if (editPengurusId === id) cancelEditPengurus()
      } catch (error) {
        toast.error('Gagal menghapus pengurus.')
      }
    }
  }

  return (
    <div className="space-y-6 pb-10 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-slate-500"
            onClick={() => navigate({ to: '/admin/konten/kelembagaan' })}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar Lembaga
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">
            Kelola: {initialData.nama}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column - Lembaga Profile */}
        <div className="xl:col-span-1">
          <Card className="shadow-sm border-slate-200 sticky top-4">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" />
                Profil Lembaga
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveLembaga} className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo Lembaga</Label>
                  <div className="p-2 border rounded-lg bg-slate-50">
                    <ImageUpload
                      value={lembagaForm.logoUrl}
                      onChange={(url, key) =>
                        setLembagaForm({
                          ...lembagaForm,
                          logoUrl: url,
                          logoKey: key,
                        })
                      }
                      className="aspect-square w-32 h-32 mx-auto object-contain bg-white rounded-md border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama">
                    Nama Lembaga <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nama"
                    value={lembagaForm.nama}
                    onChange={(e) =>
                      setLembagaForm({ ...lembagaForm, nama: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="singkatan">
                    Singkatan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="singkatan"
                    value={lembagaForm.singkatan}
                    onChange={(e) =>
                      setLembagaForm({
                        ...lembagaForm,
                        singkatan: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    value={lembagaForm.deskripsi}
                    onChange={(e) =>
                      setLembagaForm({
                        ...lembagaForm,
                        deskripsi: e.target.value,
                      })
                    }
                    rows={4}
                    className="resize-y"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingLembaga}
                  className="w-full gap-2"
                >
                  {isSubmittingLembaga ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan Profil
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Pengurus Management */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Susunan Pengurus</CardTitle>
                <CardDescription>
                  Tambah, edit, dan kelola urutan anggota.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Form Input Inline */}
              <div className="p-4 bg-blue-50/50 border-b">
                <form
                  onSubmit={handleSavePengurus}
                  className="flex flex-col sm:flex-row items-end gap-3"
                >
                  <div className="space-y-1.5 flex-1 w-full">
                    <Label className="text-xs font-semibold text-slate-700">
                      Nama Lengkap
                    </Label>
                    <Input
                      value={pengurusForm.nama}
                      onChange={(e) =>
                        setPengurusForm({
                          ...pengurusForm,
                          nama: e.target.value,
                        })
                      }
                      placeholder="Nama anggota..."
                      required
                      className="bg-white border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1 w-full">
                    <Label className="text-xs font-semibold text-slate-700">
                      Jabatan
                    </Label>
                    <Input
                      value={pengurusForm.jabatan}
                      onChange={(e) =>
                        setPengurusForm({
                          ...pengurusForm,
                          jabatan: e.target.value,
                        })
                      }
                      placeholder="Contoh: Ketua, Sekretaris..."
                      required
                      className="bg-white border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5 w-full sm:w-24">
                    <Label className="text-xs font-semibold text-slate-700">
                      No. Urut
                    </Label>
                    <Input
                      type="number"
                      value={pengurusForm.urutan}
                      onChange={(e) =>
                        setPengurusForm({
                          ...pengurusForm,
                          urutan: parseInt(e.target.value) || 1,
                        })
                      }
                      min={1}
                      required
                      className="bg-white text-center border-blue-200 focus-visible:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {editPengurusId && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={cancelEditPengurus}
                        className="w-full sm:w-auto h-10 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmittingPengurus}
                      className={`w-full sm:w-auto h-10 gap-2 ${editPengurusId ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isSubmittingPengurus ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : editPengurusId ? (
                        <>Simpan</>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Tambah
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Table Pengurus */}
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="w-16 text-center font-semibold">
                      Urut
                    </TableHead>
                    <TableHead className="font-semibold">
                      Nama Lengkap
                    </TableHead>
                    <TableHead className="font-semibold">Jabatan</TableHead>
                    <TableHead className="text-right font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengurusList === undefined ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Skeleton className="w-8 h-4 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-40 h-4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-24 h-4" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="w-16 h-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : pengurusList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-32 text-center text-slate-500 bg-slate-50/30"
                      >
                        Belum ada anggota pengurus. Silakan tambahkan melalui
                        form di atas.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pengurusList.map((p) => (
                      <TableRow
                        key={p._id}
                        className={
                          editPengurusId === p._id ? 'bg-blue-50/30' : ''
                        }
                      >
                        <TableCell className="text-center font-medium text-slate-500">
                          {p.urutan}
                        </TableCell>
                        <TableCell className="font-medium text-slate-800">
                          {p.nama}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {p.jabatan}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPengurus(p)}
                              className={`h-8 w-8 ${editPengurusId === p._id ? 'text-blue-600 bg-blue-100' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePengurus(p._id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
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
        </div>
      </div>
    </div>
  )
}
