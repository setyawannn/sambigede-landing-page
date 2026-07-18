import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function AdminApbdes() {
  const apbdes = useQuery(api.apbdes.getApbdes, {});
  const deleteApbdes = useMutation(api.apbdes.deleteApbdes);
  const createApbdes = useMutation(api.apbdes.createApbdes);
  const updateApbdes = useMutation(api.apbdes.updateApbdes);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"apbdes"> | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    kategori: "Pendapatan" as any,
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

  const handleOpenModal = (item?: any) => {
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
    if (editId) {
      await updateApbdes({ id: editId, ...formData });
    } else {
      await createApbdes(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: Id<"apbdes">) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data APBDes ini?")) {
      await deleteApbdes({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Keuangan APBDes</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola data realisasi anggaran desa.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5A7A1E] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Tambah Anggaran
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari uraian anggaran..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B8E23]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="py-3 px-4 font-semibold">Uraian / Nama</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold text-right">Anggaran (Rp)</th>
                <th className="py-3 px-4 font-semibold text-right">Realisasi (Rp)</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredApbdes?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Tidak ada data APBDes.</td>
                </tr>
              ) : (
                filteredApbdes?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-800">{item.nama}</p>
                      <p className="text-gray-500 text-xs">Sumber: {item.sumberDana}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.kategori === 'Pendapatan' ? 'bg-green-100 text-green-700' :
                        item.kategori === 'Belanja' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-700">{formatRupiah(item.nilai)}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-700">{formatRupiah(item.realisasi)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-lg">{editId ? "Edit Anggaran" : "Tambah Anggaran"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Uraian / Nama Anggaran</label>
                  <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                  <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value as any})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none">
                    <option value="Pendapatan">Pendapatan</option>
                    <option value="Belanja">Belanja</option>
                    <option value="Pembiayaan">Pembiayaan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sumber Dana</label>
                  <input required type="text" value={formData.sumberDana} onChange={e => setFormData({...formData, sumberDana: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="Contoh: DD, ADD, PAD" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Anggaran (Rp)</label>
                  <input required type="number" value={formData.nilai} onChange={e => setFormData({...formData, nilai: Number(e.target.value)})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Realisasi (Rp)</label>
                  <input required type="number" value={formData.realisasi} onChange={e => setFormData({...formData, realisasi: Number(e.target.value)})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded font-medium text-gray-600 hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-[#6B8E23] text-white rounded font-medium hover:bg-[#5A7A1E]">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
