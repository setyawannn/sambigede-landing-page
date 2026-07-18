import { useState } from "react";
import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "../../../lib/auth";
import { useNavigate } from "@tanstack/react-router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ username: false, password: false });

  const loginMutation = useMutation(api.auth.login);
  const { login } = useAuth();
  const navigate = useNavigate();

  const uErr = touched.username && !username.trim() ? "Username wajib diisi" : "";
  const pErr = touched.password && !password ? "Password wajib diisi" : "";
  const canSubmit = username.trim() && password && !uErr && !pErr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    
    if (!canSubmit) return;
    
    setLoading(true);
    setError("");
    
    try {
      const result = await loginMutation({ username, password });
      
      if (result.success && result.user) {
        login(result.user);
        navigate({ to: "/admin" });
      } else {
        setError(result.message || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <div className="hidden lg:flex w-1/2 bg-[#6B8E23] flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 space-y-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Sistem Informasi<br />Desa Sambigede
          </h1>
          <p className="text-[#E0E7C8] text-lg max-w-md mx-auto leading-relaxed">
            Portal administrasi terpadu untuk mengelola data kependudukan, berita, dan layanan masyarakat.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden w-16 h-16 bg-[#6B8E23]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#6B8E23]" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Selamat Datang</h2>
            <p className="text-gray-500 mt-2 text-sm">Masuk ke panel admin untuk mengelola website.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                  className={`w-full px-4 py-3 rounded-xl border ${uErr ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'} focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 transition-all outline-none`}
                  placeholder="Masukkan username Anda"
                />
                {uErr && <p className="text-red-500 text-xs mt-1.5 font-medium">{uErr}</p>}
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border ${pErr ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'} focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20 transition-all outline-none`}
                    placeholder="Masukkan password Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {pErr && <p className="text-red-500 text-xs mt-1.5 font-medium">{pErr}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-base transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6B8E23] hover:bg-[#5A7A1E] shadow-lg shadow-[#6B8E23]/30'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </>
              ) : "Masuk ke Dashboard"}
            </button>
          </form>
          
          <div className="text-center text-sm text-gray-500 mt-8">
            &copy; {new Date().getFullYear()} Pemerintah Desa Sambigede.
          </div>
        </div>
      </div>
    </div>
  );
}
