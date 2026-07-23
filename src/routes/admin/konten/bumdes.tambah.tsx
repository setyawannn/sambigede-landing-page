import { createFileRoute } from '@tanstack/react-router'
import AdminBumdesForm from '../../../components/pages/admin/AdminBumdesForm'

export const Route = createFileRoute('/admin/konten/bumdes/tambah')({
  component: () => <AdminBumdesForm />,
})
