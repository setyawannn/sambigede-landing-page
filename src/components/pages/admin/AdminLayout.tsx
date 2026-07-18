import { Link, Outlet, useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { 
  LayoutDashboard, Newspaper, Users, Package, Activity, 
  Landmark, Settings, LogOut, Menu, X, Bell 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../lib/auth";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login", replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-gray-50 text-[#6B8E23]">Memuat panel admin...</div>;
  }

  if (!user) {
    return null; // Will redirect shortly
  }

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Kelola Berita", path: "/admin/berita", icon: <Newspaper className="w-5 h-5" /> },
    { name: "Data Penduduk", path: "/admin/penduduk", icon: <Users className="w-5 h-5" /> },
    { name: "Penerima Bansos", path: "/admin/bansos", icon: <Package className="w-5 h-5" /> },
    { name: "Stunting", path: "/admin/stunting", icon: <Activity className="w-5 h-5" /> },
    { name: "Keuangan APBDes", path: "/admin/apbdes", icon: <Landmark className="w-5 h-5" /> },
    { name: "Pengaturan", path: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 bg-[#0F172A]">
          <h1 className="text-white font-bold text-lg tracking-wider">Admin Panel</h1>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu Utama</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-[#6B8E23] text-white" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-[#0F172A]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-10 shrink-0 shadow-sm">
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-800">Sistem Informasi Desa Sambigede</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#6B8E23] flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-[#5A7A1E] transition-colors">
                {user.nama.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-800 leading-none">{user.nama}</p>
                <p className="text-xs text-gray-500 mt-1">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
