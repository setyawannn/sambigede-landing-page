import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useNavigate } from '@tanstack/react-router'
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../../lib/auth'
import { deleteFileFromR2 } from '../../../lib/r2'
import type { Id, Doc } from '../../../../convex/_generated/dataModel'

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { ImageUpload } from '../../ui/ImageUpload'

interface AdminBeritaFormProps {
  mode: 'create' | 'edit'
  initialData?: Doc<'berita'>
}

export default function AdminBeritaForm({
  mode,
  initialData,
}: AdminBeritaFormProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const kategoriList = useQuery(api.kategori.getKategori) || []

  const createBerita = useMutation(api.berita.createBerita)
  const updateBerita = useMutation(api.berita.updateBerita)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originalImageKey, setOriginalImageKey] = useState<string | undefined>(
    undefined,
  )

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    imageUrl: '',
    imageKey: undefined as string | undefined,
    author: '',
  })

  // Initialize data for edit or default for create
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setOriginalImageKey(initialData.imageKey)
      setFormData({
        title: initialData.title,
        content: initialData.content,
        excerpt: initialData.excerpt,
        category: initialData.category,
        imageUrl: initialData.imageUrl,
        imageKey: initialData.imageKey,
        author: initialData.author,
      })
    } else if (mode === 'create') {
      setFormData((prev) => ({
        ...prev,
        author: user?.nama || 'Admin',
        category:
          kategoriList.length > 0 ? kategoriList[0].nama : 'Berita Desa',
      }))
    }
  }, [mode, initialData, user, kategoriList])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Harap isi semua kolom wajib!')
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === 'edit' && initialData) {
        // If image was changed, delete old image from R2
        if (originalImageKey && originalImageKey !== formData.imageKey) {
          try {
            await deleteFileFromR2({ data: { fileKey: originalImageKey } })
          } catch (err) {
            console.error('Gagal menghapus gambar lama dari R2:', err)
          }
        }
        // Force the original author to remain unchanged
        await updateBerita({
          ...formData,
          id: initialData._id,
          author: initialData.author,
        })
        toast.success('Berita berhasil diperbarui!')
      } else {
        // Force the author to be the current logged-in user
        await createBerita({ ...formData, author: user?.nama || 'Admin' })
        toast.success('Berita berhasil dipublikasikan!')
      }

      // Navigate back to list
      navigate({ to: '/admin/berita' })
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan berita.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-slate-500"
            onClick={() => navigate({ to: '/admin/berita' })}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Daftar Berita
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">
            {mode === 'edit' ? 'Edit Artikel Berita' : 'Tulis Berita Baru'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/admin/berita' })}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === 'edit' ? 'Simpan Perubahan' : 'Publikasikan'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <CardTitle className="text-lg text-slate-700">
                Konten Artikel
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Judul Artikel <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ketik judul berita yang menarik di sini..."
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-semibold">
                  Kutipan Pendek (Excerpt){' '}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Tuliskan 1-2 kalimat ringkasan dari berita ini..."
                  rows={2}
                />
                <p className="text-xs text-slate-500">
                  Teks ini akan muncul di kartu cuplikan berita pada halaman
                  depan.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold">
                  Isi Konten Lengkap <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Ketik seluruh isi artikel di sini..."
                  className="min-h-[400px] leading-relaxed resize-y"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Meta Data */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                Gambar Cover
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url, key) =>
                    setFormData({ ...formData, imageUrl: url, imageKey: key })
                  }
                  className="w-full aspect-[16/9]"
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Rekomendasi rasio: 16:9 (Landscape).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <CardTitle className="text-lg text-slate-700">
                Meta Data
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val })
                  }
                >
                  <SelectTrigger id="category" className="bg-white">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriList.map((kat) => (
                      <SelectItem key={kat._id} value={kat.nama}>
                        {kat.nama}
                      </SelectItem>
                    ))}
                    {kategoriList.length === 0 && (
                      <SelectItem value="Uncategorized">
                        Belum ada kategori
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-semibold">
                  Penulis
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  disabled
                  className="bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
