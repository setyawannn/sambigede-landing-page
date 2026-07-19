import { createFileRoute } from '@tanstack/react-router'
import AdminProfil from '../../components/pages/admin/AdminProfil'

export const Route = createFileRoute('/admin/profil')({
  component: AdminProfil,
})
