import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Save, Building2, Target, Map, Users, Plus, Trash2, Loader2 } from "lucide-react";
import { ImageUpload } from "../../ui/ImageUpload";
import { toast } from "sonner";
import { deleteFileFromR2 } from "../../../lib/r2";

import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Skeleton } from "../../ui/skeleton";

export default function AdminProfil() {
  const profilData = useQuery(api.profil.getProfil);
  const updateProfil = useMutation(api.profil.updateProfil);

  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState<string[]>([]);
  const [sejarah, setSejarah] = useState("");
  const [baganUrl, setBaganUrl] = useState("");
  const [baganKey, setBaganKey] = useState<string | undefined>(undefined);
  const [originalBaganKey, setOriginalBaganKey] = useState<string | undefined>(undefined);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profilData) {
      setVisi(profilData.visi || "");
      setMisi(profilData.misi || []);
      setSejarah(profilData.sejarah || "");
      setBaganUrl(profilData.baganStrukturUrl || "");
      setBaganKey(profilData.baganStrukturKey);
      setOriginalBaganKey(profilData.baganStrukturKey);
    }
  }, [profilData]);

  const handleAddMisi = () => {
    setMisi([...misi, ""]);
  };

  const handleMisiChange = (index: number, value: string) => {
    const newMisi = [...misi];
    newMisi[index] = value;
    setMisi(newMisi);
  };

  const handleRemoveMisi = (index: number) => {
    const newMisi = [...misi];
    newMisi.splice(index, 1);
    setMisi(newMisi);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // If image changed, delete old one from R2
      if (originalBaganKey && originalBaganKey !== baganKey) {
        await deleteFileFromR2({ data: { fileKey: originalBaganKey } });
      }

      await updateProfil({
        visi,
        misi: misi.filter(m => m.trim() !== ""),
        sejarah,
        baganStrukturUrl: baganUrl,
        baganStrukturKey: baganKey,
      });

      setOriginalBaganKey(baganKey);
      toast.success("Profil Desa berhasil diperbarui!");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (profilData === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Profil Desa
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola Visi, Misi, Sejarah, dan Struktur Organisasi Desa.</p>
        </div>
        <Button type="button" onClick={handleSave} disabled={isSubmitting} className="gap-2">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visi & Misi */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
                <Target className="w-5 h-5 text-blue-500" />
                Visi Desa
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="visi">Teks Visi Utama</Label>
                <Textarea 
                  id="visi" 
                  value={visi} 
                  onChange={(e) => setVisi(e.target.value)} 
                  placeholder="Masukkan visi desa..."
                  className="min-h-[100px] text-base"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
                <Map className="w-5 h-5 text-green-500" />
                Misi Desa
              </div>
              <Button size="sm" variant="outline" onClick={handleAddMisi} className="gap-1">
                <Plus className="w-4 h-4" /> Tambah Misi
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {misi.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm bg-slate-50 rounded-lg border border-dashed">
                  Belum ada misi. Klik "Tambah Misi" untuk mulai.
                </div>
              ) : (
                misi.map((m, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="bg-slate-100 text-slate-500 w-8 h-8 rounded flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <Textarea 
                      value={m}
                      onChange={(e) => handleMisiChange(i, e.target.value)}
                      placeholder={`Misi ke-${i + 1}`}
                      className="min-h-[60px]"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveMisi(i)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Struktur & Sejarah */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
                <Users className="w-5 h-5 text-purple-500" />
                Bagan Struktur Organisasi (SOTK)
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-slate-500 mb-2">
                Unggah gambar diagram/bagan susunan organisasi pemerintahan desa. Rekomendasi rasio: 16:9 (Landscape) agar terlihat proporsional.
              </p>
              <ImageUpload
                value={baganUrl}
                onChange={(url, key) => {
                  setBaganUrl(url);
                  setBaganKey(key);
                }}
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
                <Building2 className="w-5 h-5 text-orange-500" />
                Sejarah Singkat (Opsional)
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-2">
              <Label htmlFor="sejarah">Narasi Sejarah</Label>
              <Textarea 
                id="sejarah" 
                value={sejarah} 
                onChange={(e) => setSejarah(e.target.value)} 
                placeholder="Tuliskan sejarah singkat desa..."
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
