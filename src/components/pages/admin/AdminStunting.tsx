import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function AdminStunting() {
  const stunting = useQuery(api.stunting.getStunting, {});
  const deleteStunting = useMutation(api.stunting.deleteStunting);
  const createStunting = useMutation(api.stunting.createStunting);
  const updateStunting = useMutation(api.stunting.updateStunting);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"stunting"> | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    dusun: "",
    usia: "",
    bb: "",
    tb: "",
    status: "Normal" as any,
  });

  const filteredStunting = stunting?.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.dusun.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        nama: item.nama,
        dusun: item.dusun,
        usia: item.usia,
        bb: item.bb,
        tb: item.tb,
        status: item.status,
      });
    } else {
      setEditId(null);
      setFormData({
        nama: "",
        dusun: "",
        usia: "",
        bb: "",
        tb: "",
        status: "Normal",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateStunting({ id: editId, ...formData });
    } else {
      await createStunting(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: Id<"stunting">) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data balita ini?")) {
      await deleteStunting({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Data Stunting</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola data posyandu dan perkembangan balita.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5A7A1E] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Tambah Data
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama balita atau dusun..." 
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
                <th className="py-3 px-4 font-semibold">Nama Balita</th>
                <th className="py-3 px-4 font-semibold">Dusun</th>
                <th className="py-3 px-4 font-semibold">Usia (Bulan)</th>
                <th className="py-3 px-4 font-semibold">BB / TB</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredStunting?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Tidak ada data stunting.</td>
                </tr>
              ) : (
                filteredStunting?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-800">{item.nama}</td>
                    <td className="py-3 px-4">{item.dusun}</td>
                    <td className="py-3 px-4">{item.usia} bln</td>
                    <td className="py-3 px-4">{item.bb} kg / {item.tb} cm</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Normal' ? 'bg-green-100 text-green-700' :
                        item.status === 'Risiko' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
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
              <h3 className="font-bold text-lg">{editId ? "Edit Data Balita" : "Tambah Data Balita"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Balita</label>
                  <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dusun</label>
                  <input required type="text" value={formData.dusun} onChange={e => setFormData({...formData, dusun: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Usia (Bulan)</label>
                  <input required type="text" value={formData.usia} onChange={e => setFormData({...formData, usia: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status Gizi</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none">
                    <option value="Normal">Normal</option>
                    <option value="Risiko">Risiko</option>
                    <option value="Stunting">Stunting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Berat Badan (kg)</label>
                  <input required type="text" value={formData.bb} onChange={e => setFormData({...formData, bb: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="Contoh: 10.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tinggi Badan (cm)</label>
                  <input required type="text" value={formData.tb} onChange={e => setFormData({...formData, tb: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" placeholder="Contoh: 80" />
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
