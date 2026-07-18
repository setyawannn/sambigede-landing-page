import { useAuth } from "../../../lib/auth";
import { User, Shield, Key, Bell, Save } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h2>
        <p className="text-gray-500 text-sm mt-1">Kelola informasi profil dan keamanan akun Anda.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <User className="w-5 h-5 text-[#6B8E23]" />
            Profil Pengguna
          </h3>
          <p className="text-gray-500 text-sm mt-1">Informasi dasar tentang akun Anda.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#6B8E23] flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user?.nama.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800">{user?.nama}</h4>
              <p className="text-gray-500">{user?.role}</p>
              <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                <Shield className="w-3 h-3" /> Akun Aktif
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
              <input type="text" readOnly value={user?.nama || ""} className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 text-gray-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input type="text" readOnly value={user?.username || ""} className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 text-gray-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role Akses</label>
              <input type="text" readOnly value={user?.role || ""} className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 text-gray-600 outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-500" />
            Keamanan (TBD)
          </h3>
          <p className="text-gray-500 text-sm mt-1">Ubah kata sandi dan pengaturan keamanan lainnya.</p>
        </div>
        <div className="p-6 space-y-4 opacity-50 pointer-events-none">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Saat Ini</label>
            <input type="password" placeholder="••••••••" className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:border-[#6B8E23] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Baru</label>
            <input type="password" placeholder="••••••••" className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:border-[#6B8E23] outline-none" />
          </div>
          <button className="flex items-center gap-2 bg-[#6B8E23] text-white px-4 py-2.5 rounded-lg font-medium">
            <Save className="w-4 h-4" /> Simpan Kata Sandi
          </button>
        </div>
      </div>
    </div>
  );
}
