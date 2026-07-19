import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
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

export default function AdminBansos() {
  const bansos = useQuery(api.bansos.getBansos, {});
  const deleteBansos = useMutation(api.bansos.deleteBansos);
  const createBansos = useMutation(api.bansos.createBansos);
  const updateBansos = useMutation(api.bansos.updateBansos);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"bansos"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Doc<"bansos"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    jk: "Laki-laki" as "Laki-laki" | "Perempuan" | "-",
    rt: "",
    rw: "",
    jenisBansos: "PKH" as "PKH" | "BPNT" | "BLT Dana Desa" | "Bantuan Dana Pangan" | "Lainnya",
    nominal: "",
    periode: "",
    status: "Aktif" as "Aktif" | "Selesai",
  });

  const filteredBansos = bansos?.filter(b => 
    b.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.nik.includes(searchTerm)
  );

  const handleOpenModal = (item?: Doc<"bansos">) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        nik: item.nik,
        nama: item.nama,
        jk: item.jk,
        rt: item.rt,
        rw: item.rw,
        jenisBansos: item.jenisBansos,
        nominal: item.nominal,
        periode: item.periode,
        status: item.status,
      });
    } else {
      setEditId(null);
      setFormData({
        nik: "",
        nama: "",
        jk: "Laki-laki",
        rt: "",
        rw: "",
        jenisBansos: "PKH",
        nominal: "",
        periode: "",
        status: "Aktif",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editId) {
        await updateBansos({ id: editId, ...formData });
      } else {
        await createBansos(formData);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: Doc<"bansos">) => {
    setDeleteItem(item);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Penerima Bansos</h2>
          <p className="text-slate-500 mt-1">Kelola data penerima bantuan sosial masyarakat.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Penerima
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4 border-b">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Cari nama atau NIK..." 
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
                <TableHead className="font-semibold text-slate-700">Nama / NIK</TableHead>
                <TableHead className="font-semibold text-slate-700">Alamat</TableHead>
                <TableHead className="font-semibold text-slate-700">Jenis</TableHead>
                <TableHead className="font-semibold text-slate-700">Nominal</TableHead>
                <TableHead className="font-semibold text-slate-700">Periode & Status</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bansos === undefined ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredBansos?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                    Tidak ada data bansos.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBansos?.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="py-3 font-mono text-slate-600">{item.nik}</TableCell>
                    <TableCell className="py-3 font-medium text-slate-800">{item.nama}</TableCell>
                    <TableCell className="py-3">{item.jk === "Laki-laki" ? "L" : item.jk === "Perempuan" ? "P" : "-"}</TableCell>
                    <TableCell className="py-3">RT {item.rt}/RW {item.rw}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="bg-slate-50 text-slate-700">{item.jenisBansos}</Badge>
                    </TableCell>
                    <TableCell className="py-3">Rp {parseInt(item.nominal).toLocaleString('id-ID')}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant={item.status === "Aktif" ? "default" : "secondary"} className={item.status === "Aktif" ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" : ""}>
                        {item.status}
                      </Badge>
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
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Penerima Bansos" : "Tambah Penerima Bansos"}</DialogTitle>
            <DialogDescription>
              Isi data penerima bantuan sosial secara lengkap pada formulir di bawah ini.
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
                <Label htmlFor="jk">Jenis Kelamin</Label>
                <Select value={formData.jk} onValueChange={(val: any) => setFormData({...formData, jk: val})}>
                  <SelectTrigger id="jk"><SelectValue placeholder="Pilih Jenis Kelamin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                    <SelectItem value="-">-</SelectItem>
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
                <Label htmlFor="jenisBansos">Jenis Bantuan</Label>
                <Select value={formData.jenisBansos} onValueChange={(val: any) => setFormData({...formData, jenisBansos: val})}>
                  <SelectTrigger id="jenisBansos"><SelectValue placeholder="Pilih Jenis Bantuan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PKH">PKH</SelectItem>
                    <SelectItem value="BPNT">BPNT</SelectItem>
                    <SelectItem value="BLT Dana Desa">BLT Dana Desa</SelectItem>
                    <SelectItem value="Bantuan Dana Pangan">Bantuan Dana Pangan</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nominal">Nominal (Rp)</Label>
                <Input id="nominal" required type="number" value={formData.nominal} onChange={e => setFormData({...formData, nominal: e.target.value})} placeholder="600000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periode">Periode Pencairan</Label>
                <Input id="periode" required value={formData.periode} onChange={e => setFormData({...formData, periode: e.target.value})} placeholder="Januari-Maret 2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                  <SelectTrigger id="status"><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
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
            <AlertDialogTitle>Hapus Data Bansos</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data bansos "{deleteItem?.nama}" akan dihapus secara permanen.
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
                  await deleteBansos({ id: deleteItem._id });
                  toast.success("Data bansos berhasil dihapus");
                  setDeleteItem(null);
                } catch (error) {
                  console.error("Gagal menghapus data", error);
                  toast.error("Gagal menghapus data bansos");
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
