import { createFileRoute } from '@tanstack/react-router'
import AdminPerangkat from '../../components/pages/admin/AdminPerangkat'

export const Route = createFileRoute('/admin/perangkat')({
  component: AdminPerangkat,
})
