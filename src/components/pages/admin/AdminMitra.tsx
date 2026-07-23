import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Plus, Pencil as Edit, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
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

export default function AdminMitra() {
  const mitraList = useQuery(api.mitra.getMitraList)
  const deleteMitra = useMutation(api.mitra.deleteMitra)

  // Delete State
  const [deleteItem, setDeleteItem] = useState<Doc<'mitra_desa'> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = mitraList?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedMitra =
    mitraList?.slice(
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
      await deleteMitra({ id: deleteItem._id })
      toast.success('Mitra berhasil dihapus')
      setDeleteItem(null)
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus mitra')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Mitra Desa
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data mitra kerja desa (seperti Babinsa, Bidan Desa, dll).
          </p>
        </div>
        <Link to="/admin/konten/mitra/tambah">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Tambah Mitra
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Singkatan</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mitraList === undefined ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                  </TableCell>
                </TableRow>
              ) : mitraList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-slate-500"
                  >
                    Belum ada data mitra desa yang ditambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMitra.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium text-slate-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      {item.logoUrl ? (
                        <R2Image
                          src={item.logoUrl}
                          alt={item.singkatan}
                          className="w-10 h-10 object-contain bg-slate-100 rounded p-1 border border-slate-200"
                          fallbackSrc="/images/placeholder.jpg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-slate-200">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {item.singkatan}
                    </TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {item.penanggungJawab.map((pj, i) => (
                          <span
                            key={i}
                            className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md w-fit border border-blue-100/50"
                          >
                            {pj}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to="/admin/konten/mitra/kelola/$id"
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
          {mitraList !== undefined && mitraList.length > 0 && (
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
            <AlertDialogTitle>Hapus Data Mitra?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data mitra "
              <span className="font-semibold text-slate-800">
                {deleteItem?.singkatan}
              </span>
              " akan dihapus secara permanen dari sistem.
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
