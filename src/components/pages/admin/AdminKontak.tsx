import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Save, Phone, Loader2, MapPin, Mail, Clock, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Skeleton } from "../../ui/skeleton";

export default function AdminKontak() {
  const kontakData = useQuery(api.kontak.getKontakConfig);
  const updateKontak = useMutation(api.kontak.updateKontakConfig);

  const [alamat, setAlamat] = useState("");
  const [teleponKantor, setTeleponKantor] = useState("");
  const [teleponDarurat, setTeleponDarurat] = useState("");
  const [email, setEmail] = useState("");
  const [jamPelayanan, setJamPelayanan] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (kontakData) {
      setAlamat(kontakData.alamat || "");
      setTeleponKantor(kontakData.teleponKantor || "");
      setTeleponDarurat(kontakData.teleponDarurat || "");
      setEmail(kontakData.email || "");
      setJamPelayanan(kontakData.jamPelayanan || "");
      setFacebook(kontakData.facebook || "");
      setInstagram(kontakData.instagram || "");
      setYoutube(kontakData.youtube || "");
    }
  }, [kontakData]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateKontak({
        alamat,
        teleponKantor,
        teleponDarurat,
        email,
        jamPelayanan,
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        youtube: youtube || undefined,
      });

      toast.success("Informasi Kontak berhasil diperbarui!");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui informasi kontak.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (kontakData === undefined) {
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
            <Phone className="w-6 h-6 text-primary" />
            Informasi Kontak
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data alamat, nomor telepon, email, dan sosial media desa.</p>
        </div>
        <Button type="button" onClick={handleSave} disabled={isSubmitting} className="gap-2">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detail Utama */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
                <MapPin className="w-5 h-5 text-blue-500" />
                Alamat & Kontak Utama
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap Kantor Desa</Label>
                <Textarea 
                  id="alamat" 
                  value={alamat} 
                  onChange={(e) => setAlamat(e.target.value)} 
                  placeholder="Contoh: Jalan Raya Sambigede No. 01, Kec. Binangun..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teleponKantor">Telepon Kantor Desa</Label>
                <Input 
                  id="teleponKantor" 
                  value={teleponKantor} 
                  onChange={(e) => setTeleponKantor(e.target.value)} 
                  placeholder="Contoh: +62 822-5034-5977"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teleponDarurat">Telepon Darurat / WhatsApp</Label>
                <Input 
                  id="teleponDarurat" 
                  value={teleponDarurat} 
                  onChange={(e) => setTeleponDarurat(e.target.value)} 
                  placeholder="Contoh: +62 811-2233-4455"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Resmi Desa</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Contoh: pemdes@sambigede.desa.id"
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Jam Pelayanan */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
                <Clock className="w-5 h-5 text-amber-500" />
                Jam Pelayanan
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jamPelayanan">Jadwal Operasional</Label>
                <Textarea 
                  id="jamPelayanan" 
                  value={jamPelayanan} 
                  onChange={(e) => setJamPelayanan(e.target.value)} 
                  placeholder="Contoh: Senin - Jumat: 08.00 - 15.00 WIB&#10;Sabtu - Minggu: Tutup"
                  className="min-h-[100px]"
                />
                <p className="text-xs text-slate-500">Gunakan baris baru (Enter) untuk memisahkan jadwal per hari.</p>
              </div>
            </CardContent>
          </Card>

          {/* Sosial Media */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
                <Share2 className="w-5 h-5 text-pink-500" />
                Sosial Media
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Tautan Facebook (Opsional)</Label>
                <Input 
                  id="facebook" 
                  type="url"
                  value={facebook} 
                  onChange={(e) => setFacebook(e.target.value)} 
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Tautan Instagram (Opsional)</Label>
                <Input 
                  id="instagram" 
                  type="url"
                  value={instagram} 
                  onChange={(e) => setInstagram(e.target.value)} 
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">Tautan YouTube (Opsional)</Label>
                <Input 
                  id="youtube" 
                  type="url"
                  value={youtube} 
                  onChange={(e) => setYoutube(e.target.value)} 
                  placeholder="https://youtube.com/..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
