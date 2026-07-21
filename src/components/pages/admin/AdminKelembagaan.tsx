import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useNavigate } from '@tanstack/react-router'
import {
  Plus,
  Pencil as Edit,
  Trash2,
  Handshake,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
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
import { Skeleton } from '../../ui/skeleton'
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

export default function AdminKelembagaan() {
  const navigate = useNavigate()
  const lembagaList = useQuery(api.kelembagaan.getKelembagaanList)
  const deleteLembaga = useMutation(api.kelembagaan.deleteKelembagaan)

  // States for Delete Lembaga
  const [deleteLembagaItem, setDeleteLembagaItem] =
    useState<Doc<'kelembagaan'> | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // States for Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = lembagaList?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const paginatedLembaga =
    lembagaList?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || []

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handleConfirmDeleteLembaga = async () => {
    if (!deleteLembagaItem) return
    setIsDeleting(true)
    try {
      if (deleteLembagaItem.logoKey) {
        await deleteFileFromR2({ data: { fileKey: deleteLembagaItem.logoKey } })
      }
      await deleteLembaga({ id: deleteLembagaItem._id })
      toast.success('Lembaga berhasil dihapus')
      setDeleteLembagaItem(null)
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
            Kelembagaan Desa
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data lembaga dan susunan pengurus masing-masing lembaga.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: '/admin/konten/kelembagaan/tambah' })}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Lembaga
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Nama Lembaga</TableHead>
                <TableHead>Singkatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lembagaList === undefined ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                  </TableCell>
                </TableRow>
              ) : lembagaList.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-slate-500"
                  >
                    Belum ada data lembaga.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLembaga.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium text-slate-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      {item.logoUrl ? (
                        <R2Image
                          src={item.logoUrl}
                          alt={item.singkatan}
                          className="w-10 h-10 object-contain bg-slate-100 rounded p-1"
                          fallbackSrc="/images/placeholder.jpg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>{item.singkatan}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate({
                              to: '/admin/konten/kelembagaan/kelola/$id',
                              params: { id: item._id },
                            })
                          }
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteLembagaItem(item)}
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
          {lembagaList !== undefined && lembagaList.length > 0 && (
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

      {/* Alert Delete Lembaga */}
      <AlertDialog
        open={!!deleteLembagaItem}
        onOpenChange={(open) => !open && setDeleteLembagaItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lembaga?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus lembaga{' '}
              <strong>{deleteLembagaItem?.singkatan}</strong>? Seluruh data
              susunan pengurus di dalamnya juga akan terhapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteLembaga}
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
