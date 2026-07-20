import { useParams, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import { ArrowLeft, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { Badge } from '../../ui/badge'

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka)
}

export default function AdminApbdesDetail() {
  const { tahunId } = useParams({ from: '/admin/infografis/apbdes_/$tahunId' })
  const apbdesItems = useQuery(api.apbdes.getApbdesByTahunId, { tahunId: tahunId as Id<'apbdes_tahun'> })

  if (apbdesItems === undefined) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/admin/infografis/apbdes"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rincian APBDes</h1>
          <p className="text-sm text-slate-500">Detail rincian program dan anggaran</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-[#E5E5E5] w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[1000px] w-full">
          <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[150px]">Kategori</TableHead>
                <TableHead className="w-[200px]">Bidang</TableHead>
                <TableHead>Uraian</TableHead>
                <TableHead className="w-[100px]">Sumber</TableHead>
                <TableHead className="text-right w-[150px]">Semula</TableHead>
                <TableHead className="text-right w-[150px]">Menjadi</TableHead>
                <TableHead className="text-right w-[150px]">Selisih (+/-)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apbdesItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                    Tidak ada data rincian untuk tahun ini.
                  </TableCell>
                </TableRow>
              ) : (
                apbdesItems.map(item => {
                  const selisih = (item.anggaranMenjadi || 0) - (item.anggaranSemula || 0)
                  return (
                    <TableRow key={item._id}>
                      <TableCell>
                        <Badge variant="outline" className={
                          item.kategori === 'Pendapatan' ? 'text-green-600 border-green-200 bg-green-50' : 
                          item.kategori === 'Belanja' ? 'text-red-600 border-red-200 bg-red-50' : 'text-blue-600'
                        }>
                          {item.kategori}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600" title={item.bidang || '-'}>{item.bidang || '-'}</TableCell>
                      <TableCell className="font-medium text-sm text-slate-800">{item.uraian}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {item.sumberDana || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap text-sm text-slate-500">{formatRupiah(item.anggaranSemula || 0)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap text-sm font-bold text-slate-700">{formatRupiah(item.anggaranMenjadi || 0)}</TableCell>
                      <TableCell className={`text-right whitespace-nowrap text-sm font-bold ${selisih > 0 ? 'text-emerald-600' : selisih < 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        {selisih > 0 ? '+' : ''}{formatRupiah(selisih)}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
