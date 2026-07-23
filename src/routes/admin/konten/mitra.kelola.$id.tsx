import { createFileRoute, notFound } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import AdminMitraForm from '../../../components/pages/admin/AdminMitraForm'

export const Route = createFileRoute('/admin/konten/mitra/kelola/$id')({
  loader: async ({ params, context }) => {
    const { queryClient } = context
    const data = await queryClient.ensureQueryData(
      convexQuery(api.mitra.getMitraById, {
        id: params.id as Id<'mitra_desa'>,
      }),
    )

    if (!data) {
      throw notFound()
    }
    return data
  },
  component: () => {
    const data = Route.useLoaderData()
    return <AdminMitraForm initialData={data} />
  },
})
