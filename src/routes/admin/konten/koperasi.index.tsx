import { createFileRoute } from '@tanstack/react-router'
import AdminKoperasi from '../../../components/pages/admin/AdminKoperasi'

export const Route = createFileRoute('/admin/konten/koperasi/')({
  component: AdminKoperasi,
})
