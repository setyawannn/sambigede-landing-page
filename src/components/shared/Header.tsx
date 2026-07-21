import { Link, useNavigate } from '@tanstack/react-router'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  const links = [
    { to: '/', label: 'Beranda' },
    { to: '/infografis', label: 'Infografis' },
    { to: '/profil', label: 'Profil Desa' },
    { to: '/berita', label: 'Berita' },
    { to: '/kontak', label: 'Kontak' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/images/logo-desa-sambigede.webp" 
            alt="Logo Desa Sambigede" 
            className="w-10 h-10 object-contain drop-shadow-sm" 
          />
          <div>
            <h1 className="font-bold text-[#333] text-base leading-tight">
              Desa Sambigede
            </h1>
            <p className="text-xs text-[#666] leading-tight">
              Kecamatan Binangun, Kabupaten Blitar
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === '/' }}
              className="text-sm font-medium transition-colors hover:text-[#3F7D4A] relative group whitespace-nowrap text-[#666] [&.active]:text-[#3F7D4A]"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[2px] bg-[#3F7D4A] transition-all duration-200 w-0 group-hover:w-full group-[.active]:w-full"></span>
            </Link>
          ))}
          <div className="w-[1px] h-6 bg-[#E5E5E5] mx-2"></div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors outline-none border border-transparent hover:border-slate-200">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-[#3F7D4A]/10 text-[#3F7D4A] font-bold">
                    {user.nama.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-slate-900">
                    {user.nama}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-lg" sideOffset={8}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-[#3F7D4A]/10 text-[#3F7D4A] font-bold">
                        {user.nama.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.nama}
                      </span>
                      <span className="truncate text-xs text-slate-500">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/admin"
              className="text-sm font-medium px-4 py-2 bg-[#3F7D4A]/10 text-[#3F7D4A] rounded-lg hover:bg-[#3F7D4A] hover:text-white transition-colors whitespace-nowrap"
            >
              Masuk
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-[#3F7D4A]/10 text-[#3F7D4A] font-bold">
                    {user.nama.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-lg" sideOffset={8}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-[#3F7D4A]/10 text-[#3F7D4A] font-bold">
                        {user.nama.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.nama}
                      </span>
                      <span className="truncate text-xs text-slate-500">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/admin"
              className="text-xs font-medium px-3 py-1.5 bg-[#3F7D4A]/10 text-[#3F7D4A] rounded-lg whitespace-nowrap"
            >
              Masuk
            </Link>
          )}
          <button 
            className="text-[#333] p-1 hover:bg-slate-100 rounded-md transition-colors" 
            onClick={() => setIsOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Persisted in DOM for Transitions) */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 bottom-0 w-[300px] bg-white/95 backdrop-blur-md p-6 shadow-2xl border-l border-slate-100 flex flex-col transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo-desa-sambigede.webp" 
                alt="Logo Desa Sambigede" 
                className="w-8 h-8 object-contain drop-shadow-sm" 
              />
              <h2 className="font-bold text-[#333] text-lg">Menu</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 -mr-2 rounded-full transition-colors"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-2 flex-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === '/' }}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium px-4 py-3 rounded-xl text-slate-600 transition-all hover:bg-slate-50 [&.active]:bg-[#3F7D4A]/10 [&.active]:text-[#3F7D4A] [&.active]:font-semibold border-l-4 border-l-transparent [&.active]:border-l-[#3F7D4A]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Footer Info Area */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Pusat Layanan</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">📍</span>
                </div>
                <div>
                  <p className="font-medium text-slate-800 leading-none">Balai Desa</p>
                  <p className="text-xs text-slate-500 mt-1">Kec. Binangun, Blitar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
