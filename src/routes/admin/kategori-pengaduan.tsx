import { createFileRoute } from '@tanstack/react-router'
import AdminKategoriPengaduan from '../../components/pages/admin/AdminKategoriPengaduan'

export const Route = createFileRoute('/admin/kategori-pengaduan')({
  component: AdminKategoriPengaduan,
})
