import { createFileRoute } from '@tanstack/react-router'
import AdminBeranda from '../../../components/pages/admin/AdminBeranda'

export const Route = createFileRoute('/admin/konten/beranda')({
  component: AdminBeranda,
})
