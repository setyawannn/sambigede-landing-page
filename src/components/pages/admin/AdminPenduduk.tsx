import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../ui/select";
import { Skeleton } from "../../ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../ui/alert-dialog";

export default function AdminPenduduk() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRt, setFilterRt] = useState("Semua");
  const [filterRw, setFilterRw] = useState("Semua");
  const [filterJk, setFilterJk] = useState("Semua");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const penduduk = useQuery(api.penduduk.getPendudukFiltered, {
    nama: searchTerm,
    rt: filterRt,
    rw: filterRw,
    jk: filterJk,
  });
  const deletePenduduk = useMutation(api.penduduk.deletePenduduk);
  const createPenduduk = useMutation(api.penduduk.createPenduduk);
  const updatePenduduk = useMutation(api.penduduk.updatePenduduk);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"penduduk"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Doc<"penduduk"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    ttl: "",
    jk: "Laki-laki" as "Laki-laki" | "Perempuan",
    rt: "",
    rw: "",
    status: "Belum Kawin",
    pekerjaan: "",
  });

  const totalItems = penduduk?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const currentData = penduduk?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleOpenModal = (item?: Doc<"penduduk">) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        nik: item.nik,
        nama: item.nama,
        ttl: item.ttl,
        jk: item.jk,
        rt: item.rt,
        rw: item.rw,
        status: item.status,
        pekerjaan: item.pekerjaan,
      });
    } else {
      setEditId(null);
      setFormData({
        nik: "",
        nama: "",
        ttl: "",
        jk: "Laki-laki",
        rt: "",
        rw: "",
        status: "Belum Kawin",
        pekerjaan: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await updatePenduduk({ id: editId, ...formData });
      } else {
        await createPenduduk(formData);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: Doc<"penduduk">) => {
    setDeleteItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Data Penduduk</h2>
          <p className="text-slate-500 mt-1">Kelola data demografi dan kependudukan desa.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Warga
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  type="text" 
                  placeholder="Cari nama..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 bg-slate-50"
                />
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <Select value={filterRt} onValueChange={(val) => { setFilterRt(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[120px] bg-slate-50">
                    <SelectValue placeholder="Semua RT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua">Semua RT</SelectItem>
                    {Array.from({length: 10}).map((_, i) => (
                      <SelectItem key={i} value={`00${i+1}`.slice(-3)}>{`00${i+1}`.slice(-3)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterRw} onValueChange={(val) => { setFilterRw(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[120px] bg-slate-50">
                    <SelectValue placeholder="Semua RW" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua">Semua RW</SelectItem>
                    {Array.from({length: 5}).map((_, i) => (
                      <SelectItem key={i} value={`00${i+1}`.slice(-3)}>{`00${i+1}`.slice(-3)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterJk} onValueChange={(val) => { setFilterJk(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[150px] bg-slate-50">
                    <SelectValue placeholder="Semua Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua">Semua Gender</SelectItem>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">NIK</TableHead>
                <TableHead className="font-semibold text-slate-700">Nama Lengkap</TableHead>
                <TableHead className="font-semibold text-slate-700">L/P</TableHead>
                <TableHead className="font-semibold text-slate-700">Alamat</TableHead>
                <TableHead className="font-semibold text-slate-700">Status/Pekerjaan</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {penduduk === undefined ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : currentData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    Tidak ada data penduduk yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                currentData?.map((item: Doc<"penduduk">) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="py-3 font-mono text-slate-600">{item.nik}</TableCell>
                    <TableCell className="py-3 font-medium text-slate-800">{item.nama}</TableCell>
                    <TableCell className="py-3">{item.jk === "Laki-laki" ? "L" : "P"}</TableCell>
                    <TableCell className="py-3">RT {item.rt}/RW {item.rw}</TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <span className="text-sm">{item.status}</span>
                        <span className="text-slate-500 text-xs">{item.pekerjaan}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
        {/* Pagination Section */}
        {totalItems > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> sampai <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="font-medium text-slate-700">{totalItems}</span> data
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Baris per halaman:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(val) => {
                    setItemsPerPage(Number(val));
                    setCurrentPage(1);
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
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {getPageNumbers().map((pageNum, idx) => (
                  pageNum === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">...</span>
                  ) : (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      className={`w-8 h-8 p-0 ${currentPage === pageNum ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                      onClick={() => setCurrentPage(pageNum as number)}
                    >
                      {pageNum}
                    </Button>
                  )
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  title="Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Warga" : "Tambah Warga"}</DialogTitle>
            <DialogDescription>
              Isi data penduduk secara lengkap pada formulir di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input id="nik" required value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} placeholder="350xxxx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Sesuai KTP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ttl">Tempat, Tanggal Lahir</Label>
                <Input id="ttl" required value={formData.ttl} onChange={e => setFormData({...formData, ttl: e.target.value})} placeholder="Blitar, 01-01-1990" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jk">Jenis Kelamin</Label>
                <Select value={formData.jk} onValueChange={(val: "Laki-laki" | "Perempuan") => setFormData({...formData, jk: val})}>
                  <SelectTrigger id="jk"><SelectValue placeholder="Pilih Jenis Kelamin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="rt">RT</Label>
                  <Input id="rt" required value={formData.rt} onChange={e => setFormData({...formData, rt: e.target.value})} placeholder="001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rw">RW</Label>
                  <Input id="rw" required value={formData.rw} onChange={e => setFormData({...formData, rw: e.target.value})} placeholder="001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status Perkawinan</Label>
                <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                  <SelectTrigger id="status"><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                    <SelectItem value="Kawin">Kawin</SelectItem>
                    <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                    <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pekerjaan">Pekerjaan</Label>
                <Input id="pekerjaan" required value={formData.pekerjaan} onChange={e => setFormData({...formData, pekerjaan: e.target.value})} placeholder="Pekerjaan" />
              </div>
            </div>
            
            <DialogFooter className="pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Data"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteItem !== null} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Warga</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data warga "{deleteItem?.nama}" akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async (e) => {
                e.preventDefault();
                if (!deleteItem) return;
                setIsDeleting(true);
                try {
                  await deletePenduduk({ id: deleteItem._id });
                  toast.success("Data penduduk berhasil dihapus");
                  setDeleteItem(null);
                } catch (error) {
                  console.error("Gagal menghapus data", error);
                  toast.error("Gagal menghapus data penduduk");
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
