import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useNavigate } from "@tanstack/react-router";
import { Save, ArrowLeft, Loader2, Landmark } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "../../ui/ImageUpload";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";

export default function AdminKelembagaanForm() {
  const navigate = useNavigate();

  const kelembagaanList = useQuery(api.kelembagaan.getKelembagaanList);
  const createKelembagaan = useMutation(api.kelembagaan.createKelembagaan);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    singkatan: "",
    deskripsi: "",
    logoUrl: "",
    logoKey: undefined as string | undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.singkatan) {
      toast.error("Nama dan Singkatan lembaga wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const nextUrutan = (kelembagaanList?.length || 0) + 1;
      
      const newId = await createKelembagaan({
        ...formData,
        urutan: nextUrutan,
      });

      toast.success("Lembaga berhasil ditambahkan!");
      
      // Redirect to the management page to add members
      navigate({ to: "/admin/kelembagaan/kelola/$id", params: { id: newId } });
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan lembaga baru.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="mb-2 -ml-2 text-slate-500"
            onClick={() => navigate({ to: "/admin/kelembagaan" })}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Tambah Lembaga Desa Baru</h1>
          <p className="text-slate-500 mt-1">Buat profil lembaga sebelum menambahkan anggota pengurusnya.</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600" />
            Informasi Dasar Lembaga
          </CardTitle>
          <CardDescription>Isi detail lembaga yang ada di desa.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama" className="font-semibold text-slate-700">Nama Lembaga <span className="text-red-500">*</span></Label>
                  <Input 
                    id="nama" 
                    value={formData.nama} 
                    onChange={e => setFormData({...formData, nama: e.target.value})} 
                    placeholder="Contoh: Badan Permusyawaratan Desa" 
                    required 
                    className="bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="singkatan" className="font-semibold text-slate-700">Singkatan <span className="text-red-500">*</span></Label>
                  <Input 
                    id="singkatan" 
                    value={formData.singkatan} 
                    onChange={e => setFormData({...formData, singkatan: e.target.value})} 
                    placeholder="Contoh: BPD" 
                    required 
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deskripsi" className="font-semibold text-slate-700">Deskripsi / Tugas Pokok</Label>
                  <Textarea 
                    id="deskripsi" 
                    value={formData.deskripsi} 
                    onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
                    placeholder="Tuliskan tugas pokok atau deskripsi singkat lembaga ini..."
                    rows={4}
                    className="bg-white resize-y"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Logo Lembaga (Opsional)</Label>
                  <div className="p-1 border rounded-lg bg-slate-50">
                    <ImageUpload 
                      value={formData.logoUrl} 
                      onChange={(url, key) => setFormData({...formData, logoUrl: url, logoKey: key})} 
                      className="aspect-square w-full max-w-xs mx-auto object-contain bg-white"
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-2">Gunakan gambar persegi (1:1) berformat PNG dengan latar transparan jika ada.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/kelembagaan" })} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2 bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan & Lanjut Kelola Pengurus
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
