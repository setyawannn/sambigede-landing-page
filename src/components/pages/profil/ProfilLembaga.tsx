import { useState } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '../../ui/dialog'

export type LembagaAnggota = { nama: string; jabatan: string }

interface LembagaCardProps {
  icon: React.ReactNode
  colorBg: string
  colorText: string
  title: string
  subtitle: string
  anggota: LembagaAnggota[]
}

export function LembagaCard({
  icon,
  colorBg,
  colorText,
  title,
  subtitle,
  anggota,
}: LembagaCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className="bg-[#F9F9F9] border border-[#E5E5E5] p-6 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen(true)
        }}
      >
        <div
          className={`w-14 h-14 ${colorBg} ${colorText} rounded-full flex items-center justify-center mb-4`}
        >
          {icon}
        </div>
        <h4 className="font-bold text-[#333] mb-1">{title}</h4>
        <p className="text-sm text-[#666] mb-3">{subtitle}</p>
        <span className="text-xs text-[#3F7D4A] font-medium border border-[#3F7D4A]/30 bg-[#3F7D4A]/5 px-3 py-1 rounded-full">
          Lihat Susunan Pengurus
        </span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white rounded-2xl max-h-[90vh] flex flex-col">
          <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 ${colorBg} ${colorText} rounded-full flex items-center justify-center shrink-0`}>
                {icon}
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{title}</div>
                <div className="text-sm font-medium text-slate-500">{subtitle}</div>
              </div>
            </DialogTitle>
            <DialogClose className="rounded-full p-2 hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </DialogClose>
          </div>
          <div className="overflow-y-auto p-6 text-left">
            <div>
              <h4 className="font-bold text-slate-800 border-b pb-2 mb-4">Susunan Pengurus</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {anggota.map((a, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">{a.jabatan}</p>
                    <p className="text-sm font-medium text-slate-800">{a.nama}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
