import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../../lib/auth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";
import { Trash2, Edit, Plus, X, Save, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function AdminKategoriPengaduan() {
  const { user } = useAuth();
  const kategoriList = useQuery(api.pengaduan.getKategoriList);
  const insertKategori = useMutation(api.pengaduan.insertKategori);
  const updateKategori = useMutation(api.pengaduan.updateKategori);
  const deleteKategori = useMutation(api.pengaduan.deleteKategori);

  const [newKategori, setNewKategori] = useState("");
  const [editingId, setEditingId] = useState<Id<"kategori_pengaduan"> | null>(null);
  const [editName, setEditName] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [deleteId, setDeleteId] = useState<Id<"kategori_pengaduan"> | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKategori.trim()) return;
    if (!user) return;

    setIsSubmitting(true);
    try {
      await insertKategori({
        nama: newKategori.trim(),
        adminUser: {
          username: user.username,
          nama: user.nama,
        },
      });
      toast.success("Kategori pengaduan berhasil ditambahkan!");
      setNewKategori("");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambahkan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: Id<"kategori_pengaduan">) => {
    if (!editName.trim()) return;
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateKategori({
        id,
        nama: editName.trim(),
        adminUser: {
          username: user.username,
          nama: user.nama,
        },
      });
      toast.success("Kategori pengaduan berhasil diperbarui!");
      setEditingId(null);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !user) return;

    try {
      await deleteKategori({
        id: deleteId,
        adminUser: {
          username: user.username,
          nama: user.nama,
        },
      });
      toast.success("Kategori berhasil dihapus!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menghapus kategori. Mungkin kategori sedang digunakan.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Master Kategori Pengaduan</h1>
        <p className="text-slate-500 mt-1">Kelola daftar pilihan subjek/kategori laporan dari masyarakat.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Kategori</CardTitle>
              <CardDescription>Tambahkan kategori laporan baru</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Nama Kategori..."
                    value={newKategori}
                    onChange={(e) => setNewKategori(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting || !newKategori.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kategori
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kategori</CardTitle>
              <CardDescription>Semua kategori yang tersedia di form kontak</CardDescription>
            </CardHeader>
            <CardContent>
              {kategoriList === undefined ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : kategoriList.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Belum ada kategori yang ditambahkan.
                </div>
              ) : (
                <div className="space-y-3">
                  {kategoriList.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                      {editingId === item._id ? (
                        <div className="flex-1 flex gap-2 mr-4">
                          <Input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 bg-white"
                          />
                        </div>
                      ) : (
                        <span className="font-medium text-slate-800">{item.nama}</span>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {editingId === item._id ? (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                              disabled={isSubmitting}
                            >
                              <X className="w-4 h-4 text-slate-500" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdate(item._id)}
                              disabled={isSubmitting || !editName.trim()}
                            >
                              <Save className="w-4 h-4 mr-1" /> Simpan
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditingId(item._id);
                                setEditName(item.nama);
                              }}
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleteId(item._id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Konfirmasi Penghapusan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori ini? 
              Aksi ini tidak dapat dibatalkan. Kategori tidak bisa dihapus jika sudah ada laporan yang menggunakan kategori ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus Kategori
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
