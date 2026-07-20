import { Link, useNavigate } from '@tanstack/react-router'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'
import { useState } from 'react'
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
          <button className="text-[#333] p-1" onClick={() => setIsOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute top-0 right-0 bottom-0 w-[280px] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-[#333]">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#333] p-2 -mr-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  activeOptions={{ exact: link.to === '/' }}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium p-2 -mx-2 rounded-lg text-[#666] [&.active]:bg-[#F5F5F5] [&.active]:text-[#3F7D4A]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
