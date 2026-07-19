import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Plus, Pencil as Edit, Trash2, FolderTree, Loader2 } from "lucide-react";
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
import { Skeleton } from "../../ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../ui/alert-dialog";

export default function AdminKategori() {
  const kategori = useQuery(api.kategori.getKategori);
  const createKategori = useMutation(api.kategori.createKategori);
  const updateKategori = useMutation(api.kategori.updateKategori);
  const deleteKategori = useMutation(api.kategori.deleteKategori);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"kategori_berita"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Doc<"kategori_berita"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    slug: "",
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenModal = (item?: Doc<"kategori_berita">) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        nama: item.nama,
        slug: item.slug,
      });
    } else {
      setEditId(null);
      setFormData({
        nama: "",
        slug: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.slug) {
      toast.error("Nama dan slug kategori harus diisi");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editId) {
        await updateKategori({ id: editId, ...formData });
        toast.success("Kategori berhasil diperbarui");
      } else {
        await createKategori(formData);
        toast.success("Kategori berhasil ditambahkan");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menyimpan kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: Doc<"kategori_berita">) => {
    setDeleteItem(item);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await deleteKategori({ id: deleteItem._id });
      toast.success("Kategori berhasil dihapus");
      setDeleteItem(null);
    } catch (error) {
      console.error("Gagal menghapus kategori", error);
      toast.error("Gagal menghapus kategori");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Kategori Berita</h2>
          <p className="text-slate-500 mt-1">Kelola data master untuk kategori artikel atau berita.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Kategori
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Nama Kategori</TableHead>
                <TableHead className="font-semibold text-slate-700">Slug URL</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kategori === undefined ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : kategori.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                    Belum ada kategori berita yang ditambahkan.
                  </TableCell>
                </TableRow>
              ) : (
                kategori.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shadow-sm">
                          <FolderTree className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="font-semibold text-slate-800">{item.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-slate-500 font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                        {item.slug}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
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
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            <DialogDescription>
              {editId ? "Perbarui informasi kategori." : "Tambahkan kategori baru untuk berita."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Kategori</Label>
              <Input 
                id="nama" 
                required 
                value={formData.nama} 
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, nama: val, slug: generateSlug(val) });
                }} 
                placeholder="Contoh: Pariwisata" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug URL</Label>
              <Input 
                id="slug" 
                required 
                value={formData.slug} 
                onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                placeholder="contoh: pariwisata" 
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500">
                Slug digunakan sebagai identifier pada URL, harus unik dan tanpa spasi.
              </p>
            </div>
            
            <DialogFooter className="pt-4 mt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteItem !== null} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kategori "{deleteItem?.nama}" akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
