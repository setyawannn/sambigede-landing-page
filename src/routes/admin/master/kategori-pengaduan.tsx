import { createFileRoute } from '@tanstack/react-router'
import AdminKategoriPengaduan from '../../../components/pages/admin/AdminKategoriPengaduan'

export const Route = createFileRoute('/admin/master/kategori-pengaduan')({
  component: AdminKategoriPengaduan,
})
