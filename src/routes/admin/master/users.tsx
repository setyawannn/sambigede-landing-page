import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../../../lib/auth'
import AdminUsers from '../../../components/pages/admin/AdminUsers'

export const Route = createFileRoute('/admin/master/users')({
  component: AdminUsersRoute,
})

function AdminUsersRoute() {
  const { user } = useAuth()

  // Guard: Hanya Superadmin yang boleh mengakses halaman ini
  if (user?.role !== 'Superadmin') {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">403</h1>
        <p className="text-lg text-slate-500">Akses Ditolak: Anda tidak memiliki wewenang untuk melihat halaman ini.</p>
      </div>
    )
  }

  return <AdminUsers />
}
