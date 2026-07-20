import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuth } from '../../../lib/auth'
import AdminRtRw from '../../../components/pages/admin/AdminRtRw'

export const Route = createFileRoute('/admin/konten/rt-rw')({
  component: AdminRtRwRoute,
})

function AdminRtRwRoute() {
  const { user } = useAuth()

  // Guard: Roles that can access this page
  if (
    !user ||
    !['Superadmin', 'Editor Konten', 'Editor'].includes(user.role)
  ) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">403</h1>
        <p className="text-lg text-slate-500">
          Akses Ditolak: Anda tidak memiliki wewenang untuk melihat halaman ini.
        </p>
      </div>
    )
  }

  return <AdminRtRw />
}
