import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react'
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

export default function AdminStunting() {
  const stunting = useQuery(api.stunting.getStunting, {})
  const deleteStunting = useMutation(api.stunting.deleteStunting)
  const createStunting = useMutation(api.stunting.createStunting)
  const updateStunting = useMutation(api.stunting.updateStunting)

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<Id<'stunting'> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Doc<'stunting'> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    nama: '',
    dusun: '',
    usia: '',
    bb: '',
    tb: '',
    status: 'Normal' as 'Normal' | 'Risiko' | 'Stunting',
  })

  const filteredStunting = stunting?.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dusun.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenModal = (item?: Doc<'stunting'>) => {
    if (item) {
      setEditId(item._id)
      setFormData({
        nama: item.nama,
        dusun: item.dusun,
        usia: item.usia,
        bb: item.bb,
        tb: item.tb,
        status: item.status,
      })
    } else {
      setEditId(null)
      setFormData({
        nama: '',
        dusun: '',
        usia: '',
        bb: '',
        tb: '',
        status: 'Normal',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editId) {
        await updateStunting({ id: editId, ...formData })
      } else {
        await createStunting(formData)
      }
      setIsModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (item: Doc<'stunting'>) => {
    setDeleteItem(item)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Data Stunting
          </h2>
          <p className="text-slate-500 mt-1">
            Kelola data posyandu dan perkembangan balita.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Data
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4 border-b">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari nama balita atau dusun..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50"
            />
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
                  Dusun
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Usia
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Gizi (BB/TB)
                </TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Status
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
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
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
                    colSpan={6}
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
                      {item.dusun}
                    </TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {item.usia} bln
                    </TableCell>
                    <TableCell className="py-3 text-slate-600">
                      {item.bb} kg <span className="text-slate-300">/</span>{' '}
                      {item.tb} cm
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className={
                          item.status === 'Normal'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : item.status === 'Risiko'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }
                      >
                        {item.status}
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
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Edit Data Balita' : 'Tambah Data Balita'}
            </DialogTitle>
            <DialogDescription>
              Catat perkembangan balita untuk pemantauan stunting.
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
                <Label htmlFor="dusun">Dusun</Label>
                <Input
                  id="dusun"
                  required
                  value={formData.dusun}
                  onChange={(e) =>
                    setFormData({ ...formData, dusun: e.target.value })
                  }
                  placeholder="Nama dusun/alamat"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usia">Usia (Bulan)</Label>
                <Input
                  id="usia"
                  required
                  value={formData.usia}
                  onChange={(e) =>
                    setFormData({ ...formData, usia: e.target.value })
                  }
                  placeholder="Contoh: 12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status Gizi</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: 'Normal' | 'Risiko' | 'Stunting') =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Risiko">Risiko</SelectItem>
                    <SelectItem value="Stunting">Stunting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bb">Berat Badan (kg)</Label>
                <Input
                  id="bb"
                  required
                  value={formData.bb}
                  onChange={(e) =>
                    setFormData({ ...formData, bb: e.target.value })
                  }
                  placeholder="Contoh: 10.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tb">Tinggi Badan (cm)</Label>
                <Input
                  id="tb"
                  required
                  value={formData.tb}
                  onChange={(e) =>
                    setFormData({ ...formData, tb: e.target.value })
                  }
                  placeholder="Contoh: 80"
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
              onClick={async (e) => {
                e.preventDefault()
                if (!deleteItem) return
                setIsDeleting(true)
                try {
                  await deleteStunting({ id: deleteItem._id })
                  toast.success('Data stunting berhasil dihapus')
                  setDeleteItem(null)
                } catch (error) {
                  console.error('Gagal menghapus data', error)
                  toast.error('Gagal menghapus data stunting')
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
    </div>
  )
}
