import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function AdminBansos() {
  const bansos = useQuery(api.bansos.getBansos, {});
  const deleteBansos = useMutation(api.bansos.deleteBansos);
  const createBansos = useMutation(api.bansos.createBansos);
  const updateBansos = useMutation(api.bansos.updateBansos);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"bansos"> | null>(null);

  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    jk: "Laki-laki" as any,
    rt: "",
    rw: "",
    jenisBansos: "PKH" as any,
    nominal: "",
    periode: "",
    status: "Aktif" as any,
  });

  const filteredBansos = bansos?.filter(b => 
    b.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.nik.includes(searchTerm)
  );

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        nik: item.nik,
        nama: item.nama,
        jk: item.jk,
        rt: item.rt,
        rw: item.rw,
        jenisBansos: item.jenisBansos,
        nominal: item.nominal,
        periode: item.periode,
        status: item.status,
      });
    } else {
      setEditId(null);
      setFormData({
        nik: "",
        nama: "",
        jk: "Laki-laki",
        rt: "",
        rw: "",
        jenisBansos: "PKH",
        nominal: "",
        periode: "",
        status: "Aktif",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateBansos({ id: editId, ...formData });
    } else {
      await createBansos(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: Id<"bansos">) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data bansos ini?")) {
      await deleteBansos({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Penerima Bansos</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola data penerima bantuan sosial masyarakat.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5A7A1E] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Tambah Penerima
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
                <th className="py-3 px-4 font-semibold">Nama / NIK</th>
                <th className="py-3 px-4 font-semibold">Alamat (RT/RW)</th>
                <th className="py-3 px-4 font-semibold">Jenis & Nominal</th>
                <th className="py-3 px-4 font-semibold">Periode & Status</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredBansos?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Tidak ada data penerima bansos.</td>
                </tr>
              ) : (
                filteredBansos?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-800">{item.nama}</p>
                      <p className="font-mono text-gray-500 text-xs">{item.nik}</p>
                    </td>
                    <td className="py-3 px-4">RT {item.rt}/RW {item.rw}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{item.jenisBansos}</p>
                      <p className="text-gray-500 text-xs">{item.nominal}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p>{item.periode}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
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
              <h3 className="font-bold text-lg">{editId ? "Edit Data Bansos" : "Tambah Penerima Bansos"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">NIK</label>
                  <input required type="text" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Penerima</label>
                  <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Kelamin</label>
                  <select value={formData.jk} onChange={e => setFormData({...formData, jk: e.target.value as any})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                    <option value="-">-</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">RT</label>
                    <input required type="text" value={formData.rt} onChange={e => setFormData({...formData, rt: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="001" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">RW</label>
                    <input required type="text" value={formData.rw} onChange={e => setFormData({...formData, rw: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="001" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Bansos</label>
                  <select value={formData.jenisBansos} onChange={e => setFormData({...formData, jenisBansos: e.target.value as any})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none">
                    <option value="PKH">PKH</option>
                    <option value="BPNT">BPNT</option>
                    <option value="BLT Dana Desa">BLT Dana Desa</option>
                    <option value="Bantuan Dana Pangan">Bantuan Dana Pangan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nominal (Rp)</label>
                  <input required type="text" value={formData.nominal} onChange={e => setFormData({...formData, nominal: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="Contoh: Rp 3.000.000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Periode</label>
                  <input required type="text" value={formData.periode} onChange={e => setFormData({...formData, periode: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="Jan - Des 2026" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none">
                    <option value="Aktif">Aktif</option>
                    <option value="Selesai">Selesai</option>
                  </select>
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
