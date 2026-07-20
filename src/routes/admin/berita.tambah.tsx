import { createFileRoute } from '@tanstack/react-router'
import AdminBeritaForm from '../../components/pages/admin/AdminBeritaForm'

export const Route = createFileRoute('/admin/berita/tambah')({
  component: () => <AdminBeritaForm mode="create" />,
})
