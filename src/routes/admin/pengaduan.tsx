import { createFileRoute } from '@tanstack/react-router'
import AdminPengaduan from '../../components/pages/admin/AdminPengaduan'

export const Route = createFileRoute('/admin/pengaduan')({
  component: AdminPengaduan,
})
