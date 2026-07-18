import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Search, Plus, Pencil as Edit, Trash2, X } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { ImageUpload } from "../../ui/ImageUpload";
import { deleteFileFromR2 } from "../../../lib/r2";

export default function AdminBerita() {
  const berita = useQuery(api.berita.getBerita, {});
  const deleteBerita = useMutation(api.berita.deleteBerita);
  const createBerita = useMutation(api.berita.createBerita);
  const updateBerita = useMutation(api.berita.updateBerita);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<Id<"berita"> | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "Pemerintahan",
    imageUrl: "",
    imageKey: undefined as string | undefined,
    author: "Admin",
  });

  const filteredBerita = berita?.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        title: item.title,
        content: item.content,
        excerpt: item.excerpt,
        category: item.category,
        imageUrl: item.imageUrl,
        imageKey: item.imageKey,
        author: item.author,
      });
    } else {
      setEditId(null);
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "Pemerintahan",
        imageUrl: "",
        imageKey: undefined,
        author: "Admin",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await updateBerita({ id: editId, ...formData });
    } else {
      await createBerita(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (item: any) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      try {
        if (item.imageKey) {
          await deleteFileFromR2({ data: { fileKey: item.imageKey } });
        }
        await deleteBerita({ id: item._id });
      } catch (error) {
        console.error("Gagal menghapus berita", error);
        alert("Gagal menghapus berita.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Berita</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola artikel dan berita desa.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#6B8E23] hover:bg-[#5A7A1E] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Tambah Berita
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari judul berita..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="py-3 px-4 font-semibold">Judul</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold">Penulis</th>
                <th className="py-3 px-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredBerita?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">Tidak ada data berita.</td>
                </tr>
              ) : (
                filteredBerita?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="font-semibold text-gray-800">{item.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.author}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-1.5 text-[#6B8E23] hover:bg-[#6B8E23]/10 rounded transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
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
              <h3 className="font-bold text-lg">{editId ? "Edit Berita" : "Tambah Berita"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Berita</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none">
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Penulis</label>
                  <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kutipan Pendek (Excerpt)</label>
                <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Konten Lengkap</label>
                <textarea required rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border px-3 py-2 rounded focus:border-[#6B8E23] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Unggah Gambar Cover</label>
                <ImageUpload 
                  value={formData.imageUrl} 
                  onChange={(url, key) => setFormData({...formData, imageUrl: url, imageKey: key})} 
                />
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
