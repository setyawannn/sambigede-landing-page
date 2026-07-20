import { createFileRoute } from '@tanstack/react-router'
import AdminKelembagaanForm from '../../../components/pages/admin/AdminKelembagaanForm'

export const Route = createFileRoute('/admin/konten/kelembagaan/tambah')({
  component: () => <AdminKelembagaanForm />,
})
