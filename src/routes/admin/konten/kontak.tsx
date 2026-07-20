import { createFileRoute } from '@tanstack/react-router'
import AdminKontak from '../../../components/pages/admin/AdminKontak'

export const Route = createFileRoute('/admin/konten/kontak')({
  component: AdminKontak,
})
