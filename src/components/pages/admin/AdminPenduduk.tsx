import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function AdminPenduduk() {
  const penduduk = useQuery(api.penduduk.getPenduduk, {});
  const deletePenduduk = useMutation(api.penduduk.deletePenduduk);
  const createPenduduk = useMutation(api.penduduk.createPenduduk);
  const updatePenduduk = useMutation(api.penduduk.updatePenduduk);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"penduduk"> | null>(null);

  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    ttl: "",
    jk: "Laki-laki" as "Laki-laki" | "Perempuan",
    rt: "",
    rw: "",
    status: "Belum Kawin",
    pekerjaan: "",
  });

  const filteredPenduduk = penduduk?.filter(p => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.nik.includes(searchTerm)
  );

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        nik: item.nik,
        nama: item.nama,
        ttl: item.ttl,
        jk: item.jk,
        rt: item.rt,
        rw: item.rw,
        status: item.status,
        pekerjaan: item.pekerjaan,
      });
    } else {
      setEditId(null);
      setFormData({
        nik: "",
        nama: "",
        ttl: "",
        jk: "Laki-laki",
        rt: "",
        rw: "",
        status: "Belum Kawin",
        pekerjaan: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updatePenduduk({ id: editId, ...formData });
    } else {
      await createPenduduk(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: Id<"penduduk">) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data penduduk ini?")) {
      await deletePenduduk({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Penduduk</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola data demografi dan kependudukan desa.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5A7A1E] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Tambah Warga
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama atau NIK..." 
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
                <th className="py-3 px-4 font-semibold">NIK</th>
                <th className="py-3 px-4 font-semibold">Nama Lengkap</th>
                <th className="py-3 px-4 font-semibold">L/P</th>
                <th className="py-3 px-4 font-semibold">Alamat (RT/RW)</th>
                <th className="py-3 px-4 font-semibold">Status/Pekerjaan</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredPenduduk?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Tidak ada data penduduk.</td>
                </tr>
              ) : (
                filteredPenduduk?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-600">{item.nik}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{item.nama}</td>
                    <td className="py-3 px-4">{item.jk === "Laki-laki" ? "L" : "P"}</td>
                    <td className="py-3 px-4">RT {item.rt}/RW {item.rw}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span>{item.status}</span>
                        <span className="text-gray-500 text-xs">{item.pekerjaan}</span>
                      </div>
                    </td>
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
              <h3 className="font-bold text-lg">{editId ? "Edit Warga" : "Tambah Warga"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">NIK</label>
                  <input required type="text" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                  <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tempat, Tanggal Lahir</label>
                  <input required type="text" value={formData.ttl} onChange={e => setFormData({...formData, ttl: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="Contoh: Blitar, 01-01-1990" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Kelamin</label>
                  <select value={formData.jk} onChange={e => setFormData({...formData, jk: e.target.value as any})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">RT</label>
                  <input required type="text" value={formData.rt} onChange={e => setFormData({...formData, rt: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="001" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">RW</label>
                  <input required type="text" value={formData.rw} onChange={e => setFormData({...formData, rw: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="001" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status Perkawinan</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none">
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pekerjaan</label>
                  <input required type="text" value={formData.pekerjaan} onChange={e => setFormData({...formData, pekerjaan: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
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
