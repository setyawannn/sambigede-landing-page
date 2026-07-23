import { createFileRoute, notFound } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import AdminKoperasiForm from '../../../components/pages/admin/AdminKoperasiForm'

export const Route = createFileRoute('/admin/konten/koperasi/kelola/$id')({
  loader: async ({ params, context }) => {
    const { queryClient } = context
    const data = await queryClient.ensureQueryData(
      convexQuery(api.koperasi.getKoperasiById, {
        id: params.id as Id<'koperasi'>,
      }),
    )

    if (!data) {
      throw notFound()
    }
    return data
  },
  component: () => {
    const data = Route.useLoaderData()
    return <AdminKoperasiForm initialData={data} />
  },
})
