import { useState } from "react";
import { X } from "lucide-react";

export type LembagaAnggota = { nama: string; jabatan: string };

interface LembagaCardProps {
  icon: React.ReactNode;
  colorBg: string;
  colorText: string;
  title: string;
  subtitle: string;
  anggota: LembagaAnggota[];
}

export function LembagaCard({
  icon,
  colorBg,
  colorText,
  title,
  subtitle,
  anggota,
}: LembagaCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="bg-[#F9F9F9] border border-[#E5E5E5] p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
      >
        <div className={`w-14 h-14 ${colorBg} ${colorText} rounded-full flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h4 className="font-bold text-[#333] mb-1">{title}</h4>
        <p className="text-sm text-[#666] mb-3">{subtitle}</p>
        <span className="text-xs text-[#6B8E23] font-medium border border-[#6B8E23]/30 bg-[#6B8E23]/5 px-3 py-1 rounded-full">
          Lihat Susunan Pengurus
        </span>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#6B8E23] px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-white font-bold text-base">{title}</h3>
                <p className="text-white/80 text-xs mt-0.5">{subtitle}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white p-1"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5] sticky top-0">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">No</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">Nama</th>
                    <th className="px-5 py-3 text-xs font-semibold text-[#333] uppercase tracking-wide">Jabatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {anggota.map((a, i) => (
                    <tr key={i} className="hover:bg-[#F5F5F5]">
                      <td className="px-5 py-3 text-[#999] text-xs">{i + 1}</td>
                      <td className="px-5 py-3 font-medium text-[#333]">{a.nama}</td>
                      <td className="px-5 py-3 text-[#666] text-xs">{a.jabatan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
