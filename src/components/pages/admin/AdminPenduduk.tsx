import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useState } from 'react'
import { Plus, Trash2, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import type { Id } from '../../../../convex/_generated/dataModel'

import { Card, CardContent, CardHeader } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'

export default function AdminPenduduk() {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'pekerjaan' | 'usia' | 'pendidikan' | 'agama'
  >('summary')

  const summary = useQuery(api.demografi.getSummary)
  const updateSummary = useMutation(api.demografi.updateSummary)

  const pekerjaanList = useQuery(api.demografi.getPekerjaan)
  const savePekerjaan = useMutation(api.demografi.savePekerjaan)

  const usiaList = useQuery(api.demografi.getUsia)
  const saveUsia = useMutation(api.demografi.saveUsia)

  const pendidikanList = useQuery(api.demografi.getPendidikan)
  const savePendidikan = useMutation(api.demografi.savePendidikan)

  const agamaList = useQuery(api.demografi.getAgama)
  const saveAgama = useMutation(api.demografi.saveAgama)

  const [isSaving, setIsSaving] = useState(false)

  // States for Editing
  const [editSummary, setEditSummary] = useState<any>(null)
  const [editPekerjaan, setEditPekerjaan] = useState<any[]>([])
  const [editUsia, setEditUsia] = useState<any[]>([])
  const [editPendidikan, setEditPendidikan] = useState<any[]>([])
  const [editAgama, setEditAgama] = useState<any[]>([])

  // Init state from query
  if (summary && !editSummary) setEditSummary(summary)
  if (pekerjaanList && editPekerjaan.length === 0 && !isSaving)
    setEditPekerjaan(pekerjaanList)
  if (usiaList && editUsia.length === 0 && !isSaving) setEditUsia(usiaList)
  if (pendidikanList && editPendidikan.length === 0 && !isSaving)
    setEditPendidikan(pendidikanList)
  if (agamaList && editAgama.length === 0 && !isSaving) setEditAgama(agamaList)

  const handleSaveSummary = async () => {
    setIsSaving(true)
    try {
      await updateSummary({
        totalPenduduk: Number(editSummary.totalPenduduk),
        jumlahLaki: Number(editSummary.jumlahLaki),
        jumlahPerempuan: Number(editSummary.jumlahPerempuan),
        jumlahKK: Number(editSummary.jumlahKK),
        usiaProduktif: Number(editSummary.usiaProduktif),
        usiaLanjut50Plus: Number(editSummary.usiaLanjut50Plus),
      })
      toast.success('Data ringkasan KPI berhasil disimpan')
    } catch (e) {
      toast.error('Gagal menyimpan data KPI')
    }
    setIsSaving(false)
  }

  const handleSavePekerjaan = async () => {
    setIsSaving(true)
    try {
      const dataToSave = editPekerjaan.map((p, i) => ({
        _id: p._id as Id<'demografi_pekerjaan'> | undefined,
        pekerjaan: p.pekerjaan,
        jumlahLaki: Number(p.jumlahLaki),
        jumlahPerempuan: Number(p.jumlahPerempuan),
        urutan: i + 1,
      }))
      await savePekerjaan({ data: dataToSave })
      toast.success('Data Pekerjaan berhasil disimpan')
    } catch (e) {
      toast.error('Gagal menyimpan data Pekerjaan')
    }
    setIsSaving(false)
  }

  const handleSaveUsia = async () => {
    setIsSaving(true)
    try {
      const dataToSave = editUsia.map((u) => ({
        _id: u._id as Id<'demografi_usia'>,
        jumlahLaki: Number(u.jumlahLaki),
        jumlahPerempuan: Number(u.jumlahPerempuan),
      }))
      await saveUsia({ data: dataToSave })
      toast.success('Data Usia berhasil disimpan')
    } catch (e) {
      toast.error('Gagal menyimpan data Usia')
    }
    setIsSaving(false)
  }

  const handleSavePendidikan = async () => {
    setIsSaving(true)
    try {
      const dataToSave = editPendidikan.map((u) => ({
        _id: u._id as Id<'demografi_pendidikan'>,
        jumlahLaki: Number(u.jumlahLaki),
        jumlahPerempuan: Number(u.jumlahPerempuan),
      }))
      await savePendidikan({ data: dataToSave })
      toast.success('Data Pendidikan berhasil disimpan')
    } catch (e) {
      toast.error('Gagal menyimpan data Pendidikan')
    }
    setIsSaving(false)
  }

  const handleSaveAgama = async () => {
    setIsSaving(true)
    try {
      const dataToSave = editAgama.map((u) => ({
        _id: u._id as Id<'demografi_agama'>,
        jumlahLaki: Number(u.jumlahLaki),
        jumlahPerempuan: Number(u.jumlahPerempuan),
      }))
      await saveAgama({ data: dataToSave })
      toast.success('Data Agama berhasil disimpan')
    } catch (e) {
      toast.error('Gagal menyimpan data Agama')
    }
    setIsSaving(false)
  }

  const addPekerjaanRow = () => {
    setEditPekerjaan([
      ...editPekerjaan,
      { pekerjaan: '', jumlahLaki: 0, jumlahPerempuan: 0 },
    ])
  }

  const removePekerjaanRow = (idx: number) => {
    setEditPekerjaan(editPekerjaan.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Kelola Data Demografi
        </h2>
        <p className="text-slate-500 mt-1">
          Perbarui statistik penduduk yang akan ditampilkan pada halaman publik.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'summary', label: 'KPI Ringkasan' },
          { id: 'pekerjaan', label: 'Mata Pencaharian' },
          { id: 'usia', label: 'Kelompok Usia' },
          { id: 'pendidikan', label: 'Tingkat Pendidikan' },
          { id: 'agama', label: 'Agama' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="shadow-sm border-t-0 rounded-tl-none">
        <CardHeader className="p-4 border-b bg-slate-50/50">
          <h3 className="font-semibold text-slate-700">
            {activeTab === 'summary' && 'Ringkasan Total Penduduk & KPI'}
            {activeTab === 'pekerjaan' && 'Distribusi Mata Pencaharian'}
            {activeTab === 'usia' && 'Distribusi Kelompok Usia'}
            {activeTab === 'pendidikan' && 'Distribusi Tingkat Pendidikan'}
            {activeTab === 'agama' && 'Distribusi Agama'}
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          {/* TAB SUMMARY */}
          {activeTab === 'summary' && editSummary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <div className="space-y-2">
                  <Label>Total Penduduk</Label>
                  <Input
                    type="number"
                    value={editSummary.totalPenduduk}
                    onChange={(e) =>
                      setEditSummary({
                        ...editSummary,
                        totalPenduduk: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jumlah Kepala Keluarga (KK)</Label>
                  <Input
                    type="number"
                    value={editSummary.jumlahKK}
                    onChange={(e) =>
                      setEditSummary({
                        ...editSummary,
                        jumlahKK: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jumlah Laki-Laki</Label>
                  <Input
                    type="number"
                    value={editSummary.jumlahLaki}
                    onChange={(e) =>
                      setEditSummary({
                        ...editSummary,
                        jumlahLaki: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jumlah Perempuan</Label>
                  <Input
                    type="number"
                    value={editSummary.jumlahPerempuan}
                    onChange={(e) =>
                      setEditSummary({
                        ...editSummary,
                        jumlahPerempuan: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Usia Produktif (18-55 Thn)</Label>
                  <Input
                    type="number"
                    value={editSummary.usiaProduktif}
                    onChange={(e) =>
                      setEditSummary({
                        ...editSummary,
                        usiaProduktif: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Usia Lanjut {`>50`} Thn</Label>
                  <Input
                    type="number"
                    value={editSummary.usiaLanjut50Plus}
                    onChange={(e) =>
                      setEditSummary({
                        ...editSummary,
                        usiaLanjut50Plus: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveSummary}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}{' '}
                Simpan KPI
              </Button>
            </div>
          )}

          {/* TAB PEKERJAAN */}
          {activeTab === 'pekerjaan' && editPekerjaan.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={addPekerjaanRow}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Tambah Baris
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-semibold">
                        Mata Pencaharian
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">
                        Laki-Laki
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">
                        Perempuan
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">Jumlah</th>
                      <th className="px-4 py-2 w-12 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editPekerjaan.map((p, idx) => {
                      const total =
                        Number(p.jumlahLaki) + Number(p.jumlahPerempuan)
                      return (
                        <tr key={idx}>
                          <td className="px-4 py-2">
                            <Input
                              value={p.pekerjaan}
                              onChange={(e) => {
                                const newArr = [...editPekerjaan]
                                newArr[idx].pekerjaan = e.target.value
                                setEditPekerjaan(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={p.jumlahLaki}
                              onChange={(e) => {
                                const newArr = [...editPekerjaan]
                                newArr[idx].jumlahLaki = e.target.value
                                setEditPekerjaan(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={p.jumlahPerempuan}
                              onChange={(e) => {
                                const newArr = [...editPekerjaan]
                                newArr[idx].jumlahPerempuan = e.target.value
                                setEditPekerjaan(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2 font-medium">{total}</td>
                          <td className="px-4 py-2 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePekerjaanRow(idx)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={handleSavePekerjaan}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}{' '}
                Simpan Data Pekerjaan
              </Button>
            </div>
          )}

          {/* TAB USIA */}
          {activeTab === 'usia' && editUsia.length > 0 && (
            <div className="space-y-4 max-w-3xl">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Kelompok Usia</th>
                      <th className="px-4 py-2 font-semibold w-32">
                        Laki-Laki
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">
                        Perempuan
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editUsia.map((u, idx) => {
                      const total =
                        Number(u.jumlahLaki) + Number(u.jumlahPerempuan)
                      return (
                        <tr key={idx}>
                          <td className="px-4 py-2 font-medium">
                            {u.kelompokUsia}
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={u.jumlahLaki}
                              onChange={(e) => {
                                const newArr = [...editUsia]
                                newArr[idx].jumlahLaki = e.target.value
                                setEditUsia(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={u.jumlahPerempuan}
                              onChange={(e) => {
                                const newArr = [...editUsia]
                                newArr[idx].jumlahPerempuan = e.target.value
                                setEditUsia(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2 font-medium">{total}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={handleSaveUsia}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}{' '}
                Simpan Data Usia
              </Button>
            </div>
          )}

          {/* TAB PENDIDIKAN */}
          {activeTab === 'pendidikan' && editPendidikan.length > 0 && (
            <div className="space-y-4 max-w-3xl">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2 font-semibold">
                        Tingkat Pendidikan
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">
                        Laki-Laki
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">
                        Perempuan
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editPendidikan.map((p, idx) => {
                      const total =
                        Number(p.jumlahLaki) + Number(p.jumlahPerempuan)
                      return (
                        <tr key={idx}>
                          <td className="px-4 py-2 font-medium">{p.tingkat}</td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={p.jumlahLaki}
                              onChange={(e) => {
                                const newArr = [...editPendidikan]
                                newArr[idx].jumlahLaki = e.target.value
                                setEditPendidikan(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={p.jumlahPerempuan}
                              onChange={(e) => {
                                const newArr = [...editPendidikan]
                                newArr[idx].jumlahPerempuan = e.target.value
                                setEditPendidikan(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2 font-medium">{total}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={handleSavePendidikan}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}{' '}
                Simpan Data Pendidikan
              </Button>
            </div>
          )}

          {/* TAB AGAMA */}
          {activeTab === 'agama' && editAgama.length > 0 && (
            <div className="space-y-4 max-w-3xl">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Agama</th>
                      <th className="px-4 py-2 font-semibold w-32">
                        Laki-Laki
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">
                        Perempuan
                      </th>
                      <th className="px-4 py-2 font-semibold w-32">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editAgama.map((a, idx) => {
                      const total =
                        Number(a.jumlahLaki) + Number(a.jumlahPerempuan)
                      return (
                        <tr key={idx}>
                          <td className="px-4 py-2 font-medium">{a.agama}</td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={a.jumlahLaki}
                              onChange={(e) => {
                                const newArr = [...editAgama]
                                newArr[idx].jumlahLaki = e.target.value
                                setEditAgama(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number"
                              value={a.jumlahPerempuan}
                              onChange={(e) => {
                                const newArr = [...editAgama]
                                newArr[idx].jumlahPerempuan = e.target.value
                                setEditAgama(newArr)
                              }}
                            />
                          </td>
                          <td className="px-4 py-2 font-medium">{total}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Button
                onClick={handleSaveAgama}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}{' '}
                Simpan Data Agama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
