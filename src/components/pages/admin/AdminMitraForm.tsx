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

interface AdminMitraFormProps {
  initialData?: Doc<'mitra_desa'>
}

export default function AdminMitraForm({ initialData }: AdminMitraFormProps) {
  const navigate = useNavigate()
  const isEditing = !!initialData

  const createMitra = useMutation(api.mitra.createMitra)
  const updateMitra = useMutation(api.mitra.updateMitra)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Data
  const [formData, setFormData] = useState({
    nama: initialData?.nama || '',
    singkatan: initialData?.singkatan || '',
    penanggungJawab:
      initialData && initialData.penanggungJawab.length > 0
        ? initialData.penanggungJawab
        : [''],
    logoUrl: initialData?.logoUrl || '',
    logoKey: initialData?.logoKey || (undefined as string | undefined),
    urutan: initialData?.urutan || 1,
  })

  const handlePjChange = (index: number, value: string) => {
    const newPj = [...formData.penanggungJawab]
    newPj[index] = value
    setFormData({ ...formData, penanggungJawab: newPj })
  }

  const handleAddPj = () => {
    setFormData({
      ...formData,
      penanggungJawab: [...formData.penanggungJawab, ''],
    })
  }

  const handleRemovePj = (index: number) => {
    const newPj = [...formData.penanggungJawab]
    newPj.splice(index, 1)
    if (newPj.length === 0) newPj.push('') // Keep at least one input
    setFormData({ ...formData, penanggungJawab: newPj })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validPj = formData.penanggungJawab
      .map((p) => p.trim())
      .filter((p) => p !== '')

    if (!formData.nama || !formData.singkatan) {
      toast.error('Nama lengkap dan singkatan wajib diisi.')
      return
    }

    if (validPj.length === 0) {
      toast.error('Minimal harus ada 1 penanggung jawab.')
      return
    }

    if (!formData.logoUrl) {
      toast.error('Logo mitra wajib diunggah.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        penanggungJawab: validPj,
      }

      if (isEditing && initialData) {
        await updateMitra({
          id: initialData._id,
          ...payload,
        })
        toast.success('Data mitra berhasil diperbarui')
      } else {
        await createMitra(payload)
        toast.success('Mitra baru berhasil ditambahkan')
      }

      navigate({ to: '/admin/konten/mitra' })
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
            {isEditing ? 'Edit Mitra Desa' : 'Tambah Mitra Desa Baru'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Silakan lengkapi formulir di bawah ini untuk menyimpan data mitra
            desa.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Kolom Kiri: Identitas Mitra */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>
                    Singkatan (Contoh: Babinsa) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.singkatan}
                    onChange={(e) =>
                      setFormData({ ...formData, singkatan: e.target.value })
                    }
                    placeholder="Masukkan singkatan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Nama Lengkap (Kepanjangan) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    placeholder="Masukkan nama kepanjangan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex justify-between items-center">
                    <span>
                      Penanggung Jawab <span className="text-red-500">*</span>
                    </span>
                  </Label>
                  <div className="space-y-3">
                    {formData.penanggungJawab.map((pj, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={pj}
                          onChange={(e) => handlePjChange(index, e.target.value)}
                          placeholder={`Penanggung Jawab ${index + 1}`}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePj(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddPj}
                    className="w-full mt-3 border-dashed"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Penanggung Jawab Lain
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Urutan Tampilan</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.urutan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        urutan: parseInt(e.target.value) || 1,
                      })
                    }
                    required
                  />
                  <p className="text-xs text-slate-500">
                    Semakin kecil angkanya, semakin awal ditampilkan di daftar.
                  </p>
                </div>
              </div>

              {/* Kolom Kanan: Upload Logo */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>
                    Logo Mitra <span className="text-red-500">*</span>
                  </Label>
                  <div className="p-4 border border-dashed rounded-lg bg-slate-50 flex flex-col items-center justify-center">
                    <div className="w-full max-w-[200px]">
                      <ImageUpload
                        value={formData.logoUrl}
                        onChange={(url, key) =>
                          setFormData({
                            ...formData,
                            logoUrl: url,
                            logoKey: key,
                          })
                        }
                        className="aspect-square w-full object-contain bg-white rounded-md shadow-sm"
                      />
                    </div>
                    <p className="text-sm text-slate-500 text-center mt-4">
                      Disarankan menggunakan gambar berformat .png transparan
                      dengan rasio kotak (1:1).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-6 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/admin/konten/mitra' })}
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
                  'Simpan Mitra'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
