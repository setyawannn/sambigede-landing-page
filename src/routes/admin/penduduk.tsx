import { createFileRoute } from '@tanstack/react-router'
import AdminPenduduk from '../../components/pages/admin/AdminPenduduk'

export const Route = createFileRoute('/admin/penduduk')({
  component: AdminPenduduk,
})
