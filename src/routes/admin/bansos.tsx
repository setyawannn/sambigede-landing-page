import { createFileRoute } from '@tanstack/react-router'
import AdminBansos from '../../components/pages/admin/AdminBansos'

export const Route = createFileRoute('/admin/bansos')({
  component: AdminBansos,
})
