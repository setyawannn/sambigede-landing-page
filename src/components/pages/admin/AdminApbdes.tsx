import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Badge } from "../../ui/badge";
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

export default function AdminApbdes() {
  const apbdes = useQuery(api.apbdes.getApbdes, {});
  const deleteApbdes = useMutation(api.apbdes.deleteApbdes);
  const createApbdes = useMutation(api.apbdes.createApbdes);
  const updateApbdes = useMutation(api.apbdes.updateApbdes);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"apbdes"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Doc<"apbdes"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    kategori: "Pendapatan" as "Pendapatan" | "Belanja" | "Pembiayaan",
    nilai: 0,
    realisasi: 0,
    sumberDana: "",
  });

  const filteredApbdes = apbdes?.filter(a => 
    a.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  };

  const handleOpenModal = (item?: Doc<"apbdes">) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        nama: item.nama,
        kategori: item.kategori,
        nilai: item.nilai,
        realisasi: item.realisasi,
        sumberDana: item.sumberDana,
      });
    } else {
      setEditId(null);
      setFormData({
        nama: "",
        kategori: "Pendapatan",
        nilai: 0,
        realisasi: 0,
        sumberDana: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await updateApbdes({ id: editId, ...formData });
      } else {
        await createApbdes(formData);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: Doc<"apbdes">) => {
    setDeleteItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Keuangan APBDes</h2>
          <p className="text-slate-500 mt-1">Kelola data realisasi anggaran desa.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Anggaran
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4 border-b">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Cari uraian anggaran..." 
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
                <TableHead className="font-semibold text-slate-700">Uraian / Nama</TableHead>
                <TableHead className="font-semibold text-slate-700">Kategori</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Anggaran (Rp)</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Realisasi (Rp)</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apbdes === undefined ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredApbdes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                    Tidak ada data APBDes.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApbdes?.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="py-3">
                      <p className="font-semibold text-slate-800">{item.nama}</p>
                      <p className="text-slate-500 text-xs">Sumber: {item.sumberDana}</p>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="secondary" className={
                        item.kategori === 'Pendapatan' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' :
                        item.kategori === 'Belanja' ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' :
                        'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }>
                        {item.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right font-medium text-slate-700">{formatRupiah(item.nilai)}</TableCell>
                    <TableCell className="py-3 text-right font-medium text-slate-700">{formatRupiah(item.realisasi)}</TableCell>
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
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Anggaran" : "Tambah Anggaran"}</DialogTitle>
            <DialogDescription>
              Catat atau ubah rincian anggaran dan realisasi APBDes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="nama">Uraian / Nama Anggaran</Label>
                <Input id="nama" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Contoh: Pembangunan Jalan Desa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Select value={formData.kategori} onValueChange={(val: "Pendapatan" | "Belanja" | "Pembiayaan") => setFormData({...formData, kategori: val})}>
                  <SelectTrigger id="kategori"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendapatan">Pendapatan</SelectItem>
                    <SelectItem value="Belanja">Belanja</SelectItem>
                    <SelectItem value="Pembiayaan">Pembiayaan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sumberDana">Sumber Dana</Label>
                <Input id="sumberDana" required value={formData.sumberDana} onChange={e => setFormData({...formData, sumberDana: e.target.value})} placeholder="Contoh: DD, ADD, PAD" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nilai">Total Anggaran (Rp)</Label>
                <Input id="nilai" type="number" required value={formData.nilai || ''} onChange={e => setFormData({...formData, nilai: Number(e.target.value)})} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="realisasi">Realisasi (Rp)</Label>
                <Input id="realisasi" type="number" required value={formData.realisasi || ''} onChange={e => setFormData({...formData, realisasi: Number(e.target.value)})} placeholder="0" />
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
                  "Simpan Anggaran"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteItem !== null} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data APBDes</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Anggaran "{deleteItem?.nama}" akan dihapus secara permanen.
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
                  await deleteApbdes({ id: deleteItem._id });
                  toast.success("Data APBDes berhasil dihapus");
                  setDeleteItem(null);
                } catch (error) {
                  console.error("Gagal menghapus data", error);
                  toast.error("Gagal menghapus data APBDes");
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
