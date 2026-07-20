import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import AdminKelembagaanKelola from '../../components/pages/admin/AdminKelembagaanKelola'
import { Skeleton } from '../../components/ui/skeleton'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/admin/kelembagaan/kelola/$id')({
  component: KelolaKelembagaanComponent,
})

function KelolaKelembagaanComponent() {
  const { id } = Route.useParams()
  const lembagaId = id as Id<'kelembagaan'>

  const lembagaData = useQuery(api.kelembagaan.getKelembagaanById, {
    id: lembagaId,
  })

  if (lembagaData === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] xl:col-span-1" />
          <Skeleton className="h-[600px] xl:col-span-2" />
        </div>
      </div>
    )
  }

  if (lembagaData === null) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Data lembaga tidak ditemukan atau sudah dihapus.
      </div>
    )
  }

  return (
    <AdminKelembagaanKelola lembagaId={lembagaId} initialData={lembagaData} />
  )
}
