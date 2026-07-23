import { createFileRoute } from '@tanstack/react-router'
import AdminMitraForm from '../../../components/pages/admin/AdminMitraForm'

export const Route = createFileRoute('/admin/konten/mitra/tambah')({
  component: () => <AdminMitraForm />,
})
