import { Link } from "@tanstack/react-router";
import { Phone, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#6B8E23] text-white w-full mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-[#6B8E23] rounded-sm rotate-45"></div>
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Desa Sambigede</h2>
              <p className="text-xs text-white/80 leading-tight">Kecamatan Binangun, Kabupaten Blitar</p>
            </div>
          </div>
          <p className="text-xs text-white/80 leading-relaxed max-w-[280px]">
            Menuju Tatakelola Pemerintahan yang Berorientasi pada Keterbukaan Informasi Publik. Website Resmi Pemerintahan Desa Sambigede.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Phone className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Jelajahi */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm">Jelajahi</h3>
          <nav className="flex flex-col gap-2">
            <Link to="/" className="text-xs text-white/80 hover:text-white transition-colors">Beranda</Link>
            <Link to="/profil" className="text-xs text-white/80 hover:text-white transition-colors">Profil</Link>
            <Link to="/berita" className="text-xs text-white/80 hover:text-white transition-colors">Berita</Link>
            <Link to="/kontak" className="text-xs text-white/80 hover:text-white transition-colors">Kontak</Link>
          </nav>
        </div>

        {/* Nomor Telpon Penting */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm">Nomor Telpon Penting</h3>
          <div className="flex flex-col gap-2 text-xs text-white/80">
            <p>+62 822 5034 5977 (Kantor Desa)</p>
            <p>+62 811 2233 4455 (Darurat)</p>
          </div>
        </div>

        {/* Kontak Kami */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm">Kontak Kami</h3>
          <div className="flex flex-col gap-2 text-xs text-white/80">
            <p>Paldoyo, Sambigede</p>
            <p>Kecamatan Binangun</p>
            <p>Kabupaten Blitar, Jawa Timur 66193</p>
            <p className="mt-2">pemdes@sambigede-blitar.desa.id</p>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-[#5A7A1E] py-4 px-6 text-center">
        <p className="text-xs text-white/90">
          &copy; {new Date().getFullYear()} Hak Cipta Desa Sambigede Kecamatan Binangun Kabupaten Blitar
        </p>
      </div>
    </footer>
  );
}
