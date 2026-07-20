import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import AdminBeritaForm from '../../components/pages/admin/AdminBeritaForm'
import { Skeleton } from '../../components/ui/skeleton'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/admin/berita/edit/$id')({
  component: EditBeritaComponent,
})

function EditBeritaComponent() {
  const { id } = Route.useParams()
  // Fetch specific berita data
  const beritaData = useQuery(api.berita.getBeritaById, {
    id: id as Id<'berita'>,
  })

  if (beritaData === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (beritaData === null) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Berita tidak ditemukan atau sudah dihapus.
      </div>
    )
  }

  return <AdminBeritaForm mode="edit" initialData={beritaData} />
}
