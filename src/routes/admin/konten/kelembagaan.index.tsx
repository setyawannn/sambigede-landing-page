import { createFileRoute } from '@tanstack/react-router'
import AdminKelembagaan from '../../../components/pages/admin/AdminKelembagaan'

export const Route = createFileRoute('/admin/konten/kelembagaan/')({
  component: AdminKelembagaan,
})
