import { createFileRoute } from '@tanstack/react-router'
import AdminApbdesDetail from '../../../components/pages/admin/AdminApbdesDetail'

export const Route = createFileRoute(
  '/admin/infografis/apbdes_/$tahunId',
)({
  component: AdminApbdesDetail,
})
