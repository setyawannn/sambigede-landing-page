import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Plus,
  Pencil as Edit,
  Trash2,
  Users,
  Loader2,
  Save,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Id, Doc } from '../../../../convex/_generated/dataModel'
import { ImageUpload } from '../../ui/ImageUpload'
import { toast } from 'sonner'
import { deleteFileFromR2 } from '../../../lib/r2'
import R2Image from '../../ui/R2Image'

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
import { Badge } from '../../ui/badge'

export default function AdminPerangkat() {
  const perangkatList = useQuery(api.perangkat.getPerangkatList, {})

  const createPerangkat = useMutation(api.perangkat.createPerangkat)
  const updatePerangkat = useMutation(api.perangkat.updatePerangkat)
  const deletePerangkat = useMutation(api.perangkat.deletePerangkat)

  // States for Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = perangkatList?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedPerangkat =
    perangkatList?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || []

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<Id<'perangkat_desa'> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    nama: '',
    jabatan: '',
    imageUrl: '',
    imageKey: undefined as string | undefined,
    urutan: 1,
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
  })
  const [originalImageKey, setOriginalImageKey] = useState<string | undefined>(
    undefined,
  )

  // States for Delete
  const [deleteItem, setDeleteItem] = useState<Doc<'perangkat_desa'> | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenModal = (item?: Doc<'perangkat_desa'>) => {
    if (item) {
      setEditId(item._id)
      setOriginalImageKey(item.imageKey)
      setForm({
        nama: item.nama,
        jabatan: item.jabatan,
        imageUrl: item.imageUrl,
        imageKey: item.imageKey,
        urutan: item.urutan,
        status: item.status,
      })
    } else {
      setEditId(null)
      setOriginalImageKey(undefined)
      setForm({
        nama: '',
        jabatan: '',
        imageUrl: '',
        imageKey: undefined,
        urutan: (perangkatList?.length || 0) + 1,
        status: 'Aktif',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nama || !form.jabatan)
      return toast.error('Nama dan jabatan wajib diisi')

    setIsSubmitting(true)
    try {
      if (editId) {
        if (originalImageKey && originalImageKey !== form.imageKey) {
          await deleteFileFromR2({ data: { fileKey: originalImageKey } })
        }
        await updatePerangkat({ id: editId, ...form })
        toast.success('Data perangkat diperbarui')
      } else {
        await createPerangkat(form)
        toast.success('Perangkat baru ditambahkan')
      }
      setIsModalOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteItem) return
    setIsDeleting(true)
    try {
      if (deleteItem.imageKey) {
        await deleteFileFromR2({ data: { fileKey: deleteItem.imageKey } })
      }
      await deletePerangkat({ id: deleteItem._id })
      toast.success('Perangkat desa berhasil dihapus')
      setDeleteItem(null)
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Perangkat & Karyawan Desa
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola daftar perangkat desa yang akan tampil di halaman Profil.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Perangkat
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-16 text-center">Urut</TableHead>
                <TableHead>Foto</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perangkatList === undefined ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                  </TableCell>
                </TableRow>
              ) : perangkatList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-slate-500"
                  >
                    Belum ada data perangkat desa.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPerangkat.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="text-center font-medium text-slate-500">
                      {item.urutan}
                    </TableCell>
                    <TableCell>
                      {item.imageUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                          <R2Image
                            src={item.imageUrl}
                            alt={item.nama}
                            className="w-full h-full object-cover object-top"
                            fallbackSrc="/images/placeholder.jpg"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-xs border border-slate-200">
                          <Users className="w-4 h-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {item.nama}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {item.jabatan}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'Aktif' ? 'default' : 'secondary'
                        }
                        className={
                          item.status === 'Aktif'
                            ? 'bg-green-500 hover:bg-green-600'
                            : ''
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenModal(item)}
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteItem(item)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
          {perangkatList !== undefined && perangkatList.length > 0 && (
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
        </CardContent>
      </Card>

      {/* Modal CRUD Perangkat */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editId ? 'Edit Perangkat Desa' : 'Tambah Perangkat Baru'}
              </DialogTitle>
              <DialogDescription>
                Masukkan informasi detail perangkat desa beserta pas foto jika
                ada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jabatan</Label>
                  <Input
                    value={form.jabatan}
                    onChange={(e) =>
                      setForm({ ...form, jabatan: e.target.value })
                    }
                    placeholder="Contoh: Kepala Desa"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Urutan Tampil</Label>
                    <Input
                      type="number"
                      value={form.urutan}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          urutan: parseInt(e.target.value) || 1,
                        })
                      }
                      min={1}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status Aktif</Label>
                    <Select
                      value={form.status}
                      onValueChange={(val: 'Aktif' | 'Nonaktif') =>
                        setForm({ ...form, status: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pas Foto (Opsional)</Label>
                <p className="text-xs text-slate-500 -mt-1">
                  Rekomendasi rasio: 3:4 atau 4:5 (Portrait).
                </p>
                <div className="mt-1 border rounded-xl overflow-hidden p-1 bg-slate-50">
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={(url, key) =>
                      setForm({ ...form, imageUrl: url, imageKey: key })
                    }
                    className="!h-[200px]"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Simpan Data
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Delete */}
      <AlertDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus data{' '}
              <strong>{deleteItem?.nama}</strong> dari daftar perangkat desa?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
