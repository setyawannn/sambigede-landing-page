import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: "Beranda" },
    { to: "/infografis", label: "Infografis" },
    { to: "/profil", label: "Profil Desa" },
    { to: "/berita", label: "Berita" },
    { to: "/kontak", label: "Kontak" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6B8E23] rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-sm rotate-45"></div>
          </div>
          <div>
            <h1 className="font-bold text-[#333] text-base leading-tight">Desa Sambigede</h1>
            <p className="text-xs text-[#666] leading-tight">Kecamatan Binangun, Kabupaten Blitar</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="text-sm font-medium transition-colors hover:text-[#6B8E23] relative group whitespace-nowrap text-[#666] [&.active]:text-[#6B8E23]"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[2px] bg-[#6B8E23] transition-all duration-200 w-0 group-hover:w-full group-[.active]:w-full"></span>
            </Link>
          ))}
          <div className="w-[1px] h-6 bg-[#E5E5E5] mx-2"></div>
          <Link to="/admin" className="text-sm font-medium px-4 py-2 bg-[#6B8E23]/10 text-[#6B8E23] rounded-lg hover:bg-[#6B8E23] hover:text-white transition-colors whitespace-nowrap">
            Masuk
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/admin" className="text-xs font-medium px-3 py-1.5 bg-[#6B8E23]/10 text-[#6B8E23] rounded-lg whitespace-nowrap">
            Masuk
          </Link>
          <button
            className="text-[#333] p-1"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-0 right-0 bottom-0 w-[280px] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-[#333]">Menu</h2>
              <button onClick={() => setIsOpen(false)} className="text-[#333] p-2 -mr-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium p-2 -mx-2 rounded-lg text-[#666] [&.active]:bg-[#F5F5F5] [&.active]:text-[#6B8E23]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
