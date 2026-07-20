import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Save,
  Home,
  Image as ImageIcon,
  MessageSquare,
  Loader2,
  User,
} from 'lucide-react'
import { ImageUpload } from '../../ui/ImageUpload'
import { toast } from 'sonner'
import { deleteFileFromR2 } from '../../../lib/r2'

import { Card, CardContent, CardHeader } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import { Skeleton } from '../../ui/skeleton'

export default function AdminBeranda() {
  const berandaData = useQuery(api.beranda.getBerandaConfig)
  const updateBeranda = useMutation(api.beranda.updateBerandaConfig)
  const perangkatData = useQuery(api.perangkat.getPerangkatList, {
    status: 'Aktif',
  })

  const [heroBadge, setHeroBadge] = useState('')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [heroImageKey, setHeroImageKey] = useState<string | undefined>(
    undefined,
  )
  const [originalHeroImageKey, setOriginalHeroImageKey] = useState<
    string | undefined
  >(undefined)

  const [kadesPeriode, setKadesPeriode] = useState('')
  const [kadesSambutan, setKadesSambutan] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (berandaData) {
      setHeroBadge(berandaData.heroBadge || '')
      setHeroTitle(berandaData.heroTitle || '')
      setHeroSubtitle(berandaData.heroSubtitle || '')
      setHeroImageUrl(berandaData.heroImageUrl || '')
      setHeroImageKey(berandaData.heroImageKey)
      setOriginalHeroImageKey(berandaData.heroImageKey)
      setKadesPeriode(berandaData.kadesPeriode || '')
      setKadesSambutan(berandaData.kadesSambutan || '')
    }
  }, [berandaData])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      if (originalHeroImageKey && originalHeroImageKey !== heroImageKey) {
        await deleteFileFromR2({ data: { fileKey: originalHeroImageKey } })
      }

      await updateBeranda({
        heroBadge,
        heroTitle,
        heroSubtitle,
        heroImageUrl,
        heroImageKey,
        kadesPeriode,
        kadesSambutan,
      })

      setOriginalHeroImageKey(heroImageKey)
      toast.success('Konfigurasi Beranda berhasil diperbarui!')
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui konfigurasi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const kades = perangkatData?.find(
    (p) => p.jabatan.toLowerCase() === 'kepala desa',
  )

  if (berandaData === undefined || perangkatData === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Tampilan Beranda
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Kelola konten Hero Banner dan Sambutan Kepala Desa.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="text-lg font-bold text-slate-800">
                Hero Banner
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroBadge">Teks Lencana (Badge)</Label>
                <Input
                  id="heroBadge"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  placeholder="Contoh: Transformasi Menuju Desa Digital"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Judul Utama</Label>
                <Textarea
                  id="heroTitle"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Contoh: Selamat Datang di Desa Sambigede"
                  className="min-h-[80px]"
                />
                <p className="text-xs text-slate-500">
                  Gunakan baris baru (Enter) untuk memotong teks ke bawah.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Subjudul / Deskripsi</Label>
                <Textarea
                  id="heroSubtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Contoh: Website Resmi Desa Sambigede..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Label>Gambar Latar Belakang (Background)</Label>
                <p className="text-xs text-slate-500 mb-2">
                  Rekomendasi rasio: 16:9 (Landscape) dengan kualitas tinggi.
                </p>
                <ImageUpload
                  value={heroImageUrl}
                  onChange={(url, key) => {
                    setHeroImageUrl(url)
                    setHeroImageKey(key)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sambutan Kepala Desa */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="text-lg font-bold text-slate-800">
                Sambutan Kepala Desa
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {kades ? (
                <div className="flex items-center gap-4 p-4 border border-[#E5E5E5] rounded-xl bg-slate-50 mb-4">
                  {kades.imageUrl ? (
                    <img
                      src={kades.imageUrl}
                      alt={kades.nama}
                      className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Data Kepala Desa Aktif:
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {kades.nama}
                    </p>
                    <p className="text-xs text-slate-500">
                      Diambil dari menu Perangkat Desa
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl mb-4 text-amber-700 text-sm">
                  <strong>Peringatan:</strong> Tidak ditemukan Perangkat Desa
                  yang berstatus "Aktif" dengan jabatan "Kepala Desa". Silakan
                  tambahkan Kepala Desa terlebih dahulu di menu Perangkat Desa.
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="kadesPeriode">Periode Jabatan</Label>
                <Input
                  id="kadesPeriode"
                  value={kadesPeriode}
                  onChange={(e) => setKadesPeriode(e.target.value)}
                  placeholder="Contoh: Periode 2024 - 2029"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="kadesSambutan">Isi Sambutan</Label>
                <Textarea
                  id="kadesSambutan"
                  value={kadesSambutan}
                  onChange={(e) => setKadesSambutan(e.target.value)}
                  placeholder="Contoh: Assalamu'alaikum Warahmatullahi Wabarakatuh..."
                  className="min-h-[250px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
