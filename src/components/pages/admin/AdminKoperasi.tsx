import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Plus, Pencil as Edit, Trash2, Loader2, ChevronLeft, ChevronRight, Store } from 'lucide-react'
import type { Doc } from '../../../../convex/_generated/dataModel'
import { toast } from 'sonner'
import { deleteFileFromR2 } from '../../../lib/r2'
import R2Image from '../../ui/R2Image'

import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
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

export default function AdminKoperasi() {
  const koperasiList = useQuery(api.koperasi.getKoperasiList)
  const deleteKoperasi = useMutation(api.koperasi.deleteKoperasi)

  // Delete State
  const [deleteItem, setDeleteItem] = useState<Doc<'koperasi'> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = koperasiList?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedKoperasi =
    koperasiList?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || []

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handleConfirmDelete = async () => {
    if (!deleteItem) return
    setIsDeleting(true)
    try {
      if (deleteItem.logoKey) {
        await deleteFileFromR2({ data: { fileKey: deleteItem.logoKey } })
      }
      if (deleteItem.fotoKegiatanKeys) {
        for (const key of deleteItem.fotoKegiatanKeys) {
          await deleteFileFromR2({ data: { fileKey: key } })
        }
      }
      await deleteKoperasi({ id: deleteItem._id })
      toast.success('Koperasi berhasil dihapus')
      setDeleteItem(null)
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus Koperasi')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Koperasi Desa
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data dan informasi Koperasi yang ada di Desa Sambigede.
          </p>
        </div>
        <Link to="/admin/konten/koperasi/tambah">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Koperasi
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Nama Koperasi</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Badan Hukum</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {koperasiList === undefined ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                  </TableCell>
                </TableRow>
              ) : koperasiList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-slate-500"
                  >
                    Belum ada data Koperasi Desa yang ditambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedKoperasi.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium text-slate-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      {item.logoUrl ? (
                        <R2Image
                          src={item.logoUrl}
                          alt={item.nama}
                          className="w-12 h-12 object-contain bg-white rounded-md p-1 border border-slate-200"
                          fallbackSrc="/images/placeholder.jpg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 border border-slate-200">
                          <Store className="w-5 h-5 opacity-50" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {item.nama}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                        {item.jenis}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {item.statusHukum || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to="/admin/konten/koperasi/kelola/$id"
                          params={{ id: item._id }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
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
          {koperasiList !== undefined && koperasiList.length > 0 && (
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
                        size="icon"
                        className={`w-8 h-8 ${
                          currentPage === page ? 'bg-primary' : ''
                        }`}
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
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!deleteItem}
        onOpenChange={() => !isDeleting && setDeleteItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Koperasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data Koperasi "
              <span className="font-semibold text-slate-800">
                {deleteItem?.nama}
              </span>
              " akan dihapus secara permanen dari sistem beserta lampiran fotonya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
