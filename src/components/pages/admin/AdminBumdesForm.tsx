import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Plus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Doc } from '../../../../convex/_generated/dataModel'
import { ImageUpload } from '../../ui/ImageUpload'

import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'

interface AdminBumdesFormProps {
  initialData?: Doc<'bumdes'>
}

export default function AdminBumdesForm({ initialData }: AdminBumdesFormProps) {
  const navigate = useNavigate()
  const isEditing = !!initialData

  const createBumdes = useMutation(api.bumdes.createBumdes)
  const updateBumdes = useMutation(api.bumdes.updateBumdes)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Data
  const [formData, setFormData] = useState({
    nama: initialData?.nama || '',
    kategori: initialData?.kategori || '',
    deskripsi: initialData?.deskripsi || '',
    statusHukum: initialData?.statusHukum || '',
    kontak: initialData?.kontak || '',
    lokasi: initialData?.lokasi || '',
    mapsUrl: initialData?.mapsUrl || '',
    logoUrl: initialData?.logoUrl || '',
    logoKey: initialData?.logoKey || (undefined as string | undefined),
    fotoProduk1: initialData?.fotoProduk?.[0] || '',
    fotoKey1: initialData?.fotoProdukKeys?.[0] || (undefined as string | undefined),
    fotoProduk2: initialData?.fotoProduk?.[1] || '',
    fotoKey2: initialData?.fotoProdukKeys?.[1] || (undefined as string | undefined),
    struktur:
      initialData && initialData.struktur.length > 0
        ? initialData.struktur
        : [{ jabatan: '', nama: '' }],
    jumlahTenagaKerja: initialData?.jumlahTenagaKerja || 1,
    urutan: initialData?.urutan || 1,
  })

  const handleStrukturChange = (index: number, field: 'jabatan' | 'nama', value: string) => {
    const newStruktur = [...formData.struktur]
    newStruktur[index][field] = value
    setFormData({ ...formData, struktur: newStruktur })
  }

  const handleAddStruktur = () => {
    setFormData({
      ...formData,
      struktur: [...formData.struktur, { jabatan: '', nama: '' }],
    })
  }

  const handleRemoveStruktur = (index: number) => {
    const newStruktur = [...formData.struktur]
    newStruktur.splice(index, 1)
    if (newStruktur.length === 0) newStruktur.push({ jabatan: '', nama: '' }) // Keep at least one
    setFormData({ ...formData, struktur: newStruktur })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validStruktur = formData.struktur
      .filter((s) => s.jabatan.trim() !== '' && s.nama.trim() !== '')

    if (!formData.nama || !formData.kategori || !formData.deskripsi) {
      toast.error('Nama, Kategori, dan Deskripsi wajib diisi.')
      return
    }

    if (validStruktur.length === 0) {
      toast.error('Minimal harus ada 1 pengurus (Struktur).')
      return
    }

    // Build foto array
    const fotoProduk = []
    const fotoProdukKeys = []
    if (formData.fotoProduk1) {
      fotoProduk.push(formData.fotoProduk1)
      if (formData.fotoKey1) fotoProdukKeys.push(formData.fotoKey1)
    }
    if (formData.fotoProduk2) {
      fotoProduk.push(formData.fotoProduk2)
      if (formData.fotoKey2) fotoProdukKeys.push(formData.fotoKey2)
    }

    setIsSubmitting(true)
    try {
      const payload = {
        nama: formData.nama,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        statusHukum: formData.statusHukum,
        kontak: formData.kontak,
        lokasi: formData.lokasi,
        mapsUrl: formData.mapsUrl || undefined,
        logoUrl: formData.logoUrl || undefined,
        logoKey: formData.logoKey || undefined,
        fotoProduk: fotoProduk.length > 0 ? fotoProduk : undefined,
        fotoProdukKeys: fotoProdukKeys.length > 0 ? fotoProdukKeys : undefined,
        struktur: validStruktur,
        jumlahTenagaKerja: formData.jumlahTenagaKerja,
        urutan: formData.urutan,
      }

      if (isEditing && initialData) {
        await updateBumdes({
          id: initialData._id,
          ...payload,
        })
        toast.success('Data BUMDes berhasil diperbarui')
      } else {
        await createBumdes(payload)
        toast.success('BUMDes baru berhasil ditambahkan')
      }

      navigate({ to: '/admin/konten/bumdes' })
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan saat menyimpan data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            {isEditing ? 'Edit Data BUMDes' : 'Tambah BUMDes Baru'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Silakan lengkapi formulir di bawah ini untuk mengelola data BUMDes.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* Seksi 1: Identitas Dasar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                Identitas Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nama Unit Usaha <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: BUMDes Maju Bersama"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kategori / Bidang Usaha <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    placeholder="Contoh: Perdagangan Umum, Agribisnis"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Deskripsi BUMDes <span className="text-red-500">*</span></Label>
                  <Textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Jelaskan secara singkat tentang unit usaha ini..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Seksi 2: Legalitas & Kontak */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                Informasi Legalitas & Kontak
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>No. Sertifikat Kemenkumham / Legalitas</Label>
                  <Input
                    value={formData.statusHukum}
                    onChange={(e) => setFormData({ ...formData, statusHukum: e.target.value })}
                    placeholder="Contoh: AHU-0012345.AH.01.02.TAHUN 2023"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Kontak (WA / Telepon)</Label>
                  <Input
                    value={formData.kontak}
                    onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                    placeholder="Contoh: 081234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alamat Lengkap</Label>
                  <Textarea
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Contoh: Jl. Raya Sambigede No. 1"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tautan Google Maps</Label>
                  <Textarea
                    value={formData.mapsUrl}
                    onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                    placeholder="Salin dan tempel tautan (link) Google Maps di sini"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Seksi 3: Struktur Organisasi */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">
                Struktur Kepengurusan & SDM
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Daftar Pengurus <span className="text-red-500">*</span></Label>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-lg border">
                    {formData.struktur.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Input
                          value={item.jabatan}
                          onChange={(e) => handleStrukturChange(index, 'jabatan', e.target.value)}
                          placeholder="Jabatan (misal: Direktur)"
                          className="flex-1"
                          required
                        />
                        <Input
                          value={item.nama}
                          onChange={(e) => handleStrukturChange(index, 'nama', e.target.value)}
                          placeholder="Nama Lengkap"
                          className="flex-1"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStruktur(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddStruktur}
                      className="w-full sm:w-auto mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Pengurus
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label>Jumlah Total Tenaga Kerja</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.jumlahTenagaKerja}
                      onChange={(e) => setFormData({ ...formData, jumlahTenagaKerja: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Urutan Tampilan</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.urutan}
                      onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Seksi 4: Media & Lampiran (Opsional) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                Media & Visual <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">(Opsional)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Logo BUMDes</Label>
                  <div className="p-2 border border-dashed rounded-lg bg-slate-50">
                    <ImageUpload
                      value={formData.logoUrl}
                      onChange={(url, key) => setFormData({ ...formData, logoUrl: url, logoKey: key })}
                      className="aspect-square w-full object-contain bg-white rounded-md"
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center">Rasio 1:1, max 2MB.</p>
                </div>

                <div className="space-y-2">
                  <Label>Foto Produk / Lokasi 1</Label>
                  <div className="p-2 border border-dashed rounded-lg bg-slate-50">
                    <ImageUpload
                      value={formData.fotoProduk1}
                      onChange={(url, key) => setFormData({ ...formData, fotoProduk1: url, fotoKey1: key })}
                      className="aspect-video w-full object-cover bg-white rounded-md"
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center">Landscape (Rasio 16:9).</p>
                </div>

                <div className="space-y-2">
                  <Label>Foto Produk / Lokasi 2</Label>
                  <div className="p-2 border border-dashed rounded-lg bg-slate-50">
                    <ImageUpload
                      value={formData.fotoProduk2}
                      onChange={(url, key) => setFormData({ ...formData, fotoProduk2: url, fotoKey2: key })}
                      className="aspect-video w-full object-cover bg-white rounded-md"
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center">Landscape (Rasio 16:9).</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/admin/konten/bumdes' })}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan BUMDes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
