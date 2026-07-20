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
import { toast } from 'sonner'

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

export default function AdminRtRw() {
  const rtRwList = useQuery(api.rt_rw.getRtRwList, {})

  const createRtRw = useMutation(api.rt_rw.createRtRw)
  const updateRtRw = useMutation(api.rt_rw.updateRtRw)
  const deleteRtRw = useMutation(api.rt_rw.deleteRtRw)

  // States for Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = rtRwList?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedRtRw =
    rtRwList?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || []

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<Id<'rt_rw'> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    nama: '',
    dusun: '',
    jabatan: 'Ketua RT' as 'Ketua RT' | 'Ketua RW',
    rtRw: '',
    urutan: 1,
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
  })

  // States for Delete
  const [deleteItem, setDeleteItem] = useState<Doc<'rt_rw'> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenModal = (item?: Doc<'rt_rw'>) => {
    if (item) {
      setEditId(item._id)
      setForm({
        nama: item.nama,
        dusun: item.dusun,
        jabatan: item.jabatan,
        rtRw: item.rtRw,
        urutan: item.urutan,
        status: item.status,
      })
    } else {
      setEditId(null)
      setForm({
        nama: '',
        dusun: '',
        jabatan: 'Ketua RT',
        rtRw: '',
        urutan: (rtRwList?.length || 0) + 1,
        status: 'Aktif',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nama || !form.dusun || !form.rtRw)
      return toast.error('Semua form data wajib diisi')

    setIsSubmitting(true)
    try {
      if (editId) {
        await updateRtRw({ id: editId, ...form })
        toast.success('Data RT/RW diperbarui')
      } else {
        await createRtRw(form)
        toast.success('RT/RW baru ditambahkan')
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
      await deleteRtRw({ id: deleteItem._id })
      toast.success('Data RT/RW berhasil dihapus')
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
            Daftar Ketua RT & RW
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola daftar ketua RT dan RW yang akan tampil di halaman Profil.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Ketua RT/RW
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-16 text-center">Urut</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Dusun</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>RT / RW</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!rtRwList ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                  </TableCell>
                </TableRow>
              ) : paginatedRtRw.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-48 text-center text-slate-500"
                  >
                    Belum ada data ketua RT dan RW
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRtRw.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="text-center font-medium">
                      {item.urutan}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {item.nama}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {item.dusun}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.jabatan === 'Ketua RW' ? 'default' : 'secondary'}
                        className={
                          item.jabatan === 'Ketua RW'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }
                      >
                        {item.jabatan}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {item.rtRw}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'Aktif' ? 'default' : 'secondary'
                        }
                        className={
                          item.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
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
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteItem(item)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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

        {/* Pagination Info & Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            Menampilkan <span className="font-medium">{startItem}</span> sampai{' '}
            <span className="font-medium">{endItem}</span> dari{' '}
            <span className="font-medium">{totalItems}</span> data
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm text-slate-500">Baris per halaman:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(val) => {
                  setItemsPerPage(Number(val))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
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
                className="h-8 w-8"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center px-2 text-sm font-medium">
                {currentPage} / {totalPages === 0 ? 1 : totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Edit Ketua RT/RW' : 'Tambah Ketua RT/RW'}
            </DialogTitle>
            <DialogDescription>
              Isi form di bawah ini dengan lengkap.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                placeholder="Misal: Budi Santoso"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="jabatan">Jabatan</Label>
              <Select
                value={form.jabatan}
                onValueChange={(val: 'Ketua RT' | 'Ketua RW') =>
                  setForm({ ...form, jabatan: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ketua RT">Ketua RT</SelectItem>
                  <SelectItem value="Ketua RW">Ketua RW</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dusun">Dusun</Label>
                <Input
                  id="dusun"
                  placeholder="Misal: Sambigede"
                  value={form.dusun}
                  onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rtRw">
                  {form.jabatan === 'Ketua RT' ? 'RT / RW' : 'RW'}
                </Label>
                <Input
                  id="rtRw"
                  placeholder={
                    form.jabatan === 'Ketua RT' ? 'RT 001 / RW 001' : 'RW 001'
                  }
                  value={form.rtRw}
                  onChange={(e) => setForm({ ...form, rtRw: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="urutan">Urutan Tampilan</Label>
                <Input
                  id="urutan"
                  type="number"
                  min="1"
                  value={form.urutan}
                  onChange={(e) =>
                    setForm({ ...form, urutan: parseInt(e.target.value) || 1 })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(val: 'Aktif' | 'Nonaktif') =>
                    setForm({ ...form, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data {deleteItem?.nama} (
              {deleteItem?.jabatan})? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
