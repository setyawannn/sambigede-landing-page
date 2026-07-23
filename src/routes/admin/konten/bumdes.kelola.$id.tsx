import { createFileRoute, notFound } from '@tanstack/react-router'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import AdminBumdesForm from '../../../components/pages/admin/AdminBumdesForm'

export const Route = createFileRoute('/admin/konten/bumdes/kelola/$id')({
  loader: async ({ params, context }) => {
    const { queryClient } = context
    const data = await queryClient.ensureQueryData(
      convexQuery(api.bumdes.getBumdesById, {
        id: params.id as Id<'bumdes'>,
      }),
    )

    if (!data) {
      throw notFound()
    }
    return data
  },
  component: () => {
    const data = Route.useLoaderData()
    return <AdminBumdesForm initialData={data} />
  },
})
