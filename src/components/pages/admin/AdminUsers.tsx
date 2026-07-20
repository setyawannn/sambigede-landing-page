import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useAuth } from '../../../lib/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { MoreHorizontal, Plus, Pencil, Trash2, KeyRound, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '../../ui/skeleton'

type Role = 'Superadmin' | 'Editor Konten' | 'Operator Infografis' | 'Petugas Pengaduan' | 'Editor'

const ROLE_COLORS: Record<string, string> = {
  Superadmin: 'bg-red-100 text-red-800 hover:bg-red-200',
  'Editor Konten': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'Operator Infografis': 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
  'Petugas Pengaduan': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  Editor: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
}

export default function AdminUsers() {
  const { user } = useAuth()
  
  // Custom Cursor Pagination State
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const [currentPage, setCurrentPage] = useState(0)

  const currentCursor = cursorHistory[currentPage]
  const pageData = useQuery(api.users.getAdminUsersPage, {
    cursor: currentCursor,
    numItems: itemsPerPage,
  })
  
  const users = pageData?.page
  const isDone = pageData?.isDone
  const continueCursor = pageData?.continueCursor
  const totalItems = pageData?.totalCount || 0
  
  const startItem = totalItems === 0 ? 0 : currentPage * itemsPerPage + 1
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems)
  const createUser = useMutation(api.users.createUser)
  const updateUser = useMutation(api.users.updateUser)
  const deleteUser = useMutation(api.users.deleteUser)
  const resetPassword = useMutation(api.users.resetPassword)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)

  // Form State
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    password: '',
    role: 'Editor Konten' as Role,
  })

  const handleOpenCreate = () => {
    setFormData({ username: '', nama: '', password: '', role: 'Editor Konten' })
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (u: any) => {
    setSelectedUser(u)
    setFormData({ username: u.username, nama: u.nama, password: '', role: u.role })
    setIsEditOpen(true)
  }

  const handleOpenDelete = (u: any) => {
    setSelectedUser(u)
    setIsDeleteOpen(true)
  }

  const handleOpenReset = (u: any) => {
    setSelectedUser(u)
    setIsResetOpen(true)
  }

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || !formData.nama || !formData.password || !formData.role) {
      toast.error('Semua field wajib diisi')
      return
    }
    
    try {
      await createUser({
        username: formData.username,
        nama: formData.nama,
        passwordHash: formData.password, // In real world, hash this. Here it's plain text per setup.
        role: formData.role,
      })
      toast.success('User berhasil dibuat')
      setIsCreateOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat user')
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || !formData.nama || !formData.role) {
      toast.error('Username, nama, dan role wajib diisi')
      return
    }
    
    try {
      await updateUser({
        id: selectedUser._id,
        username: formData.username,
        nama: formData.nama,
        role: formData.role,
      })
      toast.success('User berhasil diupdate')
      setIsEditOpen(false)
    } catch (error: any) {
      toast.error(error.message || 'Gagal update user')
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedUser._id === user?.id) {
      toast.error('Anda tidak dapat menghapus akun Anda sendiri')
      setIsDeleteOpen(false)
      return
    }
    
    try {
      await deleteUser({ id: selectedUser._id })
      toast.success('User berhasil dihapus')
      setIsDeleteOpen(false)
    } catch (error: any) {
      toast.error('Gagal menghapus user')
    }
  }

  const handleConfirmReset = async () => {
    try {
      await resetPassword({ id: selectedUser._id })
      toast.success('Password berhasil direset menjadi: 12345678')
      setIsResetOpen(false)
    } catch (error: any) {
      toast.error('Gagal mereset password')
    }
  }

  // Pagination Handlers
  const handleNext = () => {
    if (pageData && !isDone) {
      const nextHistory = [...cursorHistory.slice(0, currentPage + 1), continueCursor as string]
      setCursorHistory(nextHistory)
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrev = () => {
    setCurrentPage(Math.max(0, currentPage - 1))
  }

  if (users === undefined) {
    return (
      <div className="w-full space-y-6 pb-10">
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Kelola User Admin
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manajemen hak akses, role, dan akun pengelola sistem desa.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Nama Pengguna</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role Akses</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell className="font-medium text-slate-800">{u.nama}</TableCell>
                  <TableCell className="text-slate-600">@{u.username}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={ROLE_COLORS[u.role] || ''}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleOpenEdit(u)} className="cursor-pointer">
                          <Pencil className="w-4 h-4 mr-2" /> Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenReset(u)} className="cursor-pointer text-amber-600">
                          <KeyRound className="w-4 h-4 mr-2" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleOpenDelete(u)}
                          className="cursor-pointer text-red-600 focus:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Hapus User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                    Belum ada data user.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {users !== undefined && (
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
                      setCursorHistory([null])
                      setCurrentPage(0)
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
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    title="Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="default" className="w-8 h-8 p-0 bg-primary text-primary-foreground">
                    {currentPage + 1}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={handleNext}
                    disabled={isDone || users.length < itemsPerPage}
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

      {/* CREATE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah User Baru</DialogTitle>
            <DialogDescription>
              Buat akun baru untuk pengelola sistem. Password dapat diganti oleh user nanti.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                placeholder="Masukkan username unik"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role / Hak Akses</label>
              <Select value={formData.role} onValueChange={(val: Role) => setFormData({ ...formData, role: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hak akses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Superadmin">Superadmin</SelectItem>
                  <SelectItem value="Editor Konten">Editor Konten</SelectItem>
                  <SelectItem value="Operator Infografis">Operator Infografis</SelectItem>
                  <SelectItem value="Petugas Pengaduan">Petugas Pengaduan</SelectItem>
                  <SelectItem value="Editor">Editor (Legacy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Ubah data akun {selectedUser?.nama}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                placeholder="Masukkan username unik"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role / Hak Akses</label>
              <Select value={formData.role} onValueChange={(val: Role) => setFormData({ ...formData, role: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hak akses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Superadmin">Superadmin</SelectItem>
                  <SelectItem value="Editor Konten">Editor Konten</SelectItem>
                  <SelectItem value="Operator Infografis">Operator Infografis</SelectItem>
                  <SelectItem value="Petugas Pengaduan">Petugas Pengaduan</SelectItem>
                  <SelectItem value="Editor">Editor (Legacy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RESET PASSWORD MODAL */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mereset password akun <strong>{selectedUser?.nama}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="text-sm text-slate-600">
              Password akan direset menjadi: <span className="font-mono font-bold bg-slate-100 px-2 py-1 rounded">12345678</span>
            </p>
            <p className="text-sm text-amber-600 font-medium">
              Aksi ini akan menimpa password yang saat ini digunakan oleh user.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetOpen(false)}>
              Batal
            </Button>
            <Button variant="default" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleConfirmReset}>
              Ya, Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus akun <strong>{selectedUser?.nama}</strong> secara permanen?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
