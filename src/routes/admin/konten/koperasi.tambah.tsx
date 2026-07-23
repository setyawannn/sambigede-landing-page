import { createFileRoute } from '@tanstack/react-router'
import AdminKoperasiForm from '../../../components/pages/admin/AdminKoperasiForm'

export const Route = createFileRoute('/admin/konten/koperasi/tambah')({
  component: () => <AdminKoperasiForm />,
})
