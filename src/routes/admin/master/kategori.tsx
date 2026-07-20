import { createFileRoute } from '@tanstack/react-router'
import AdminKategori from '../../../components/pages/admin/AdminKategori'

export const Route = createFileRoute('/admin/master/kategori')({
  component: AdminKategori,
})
