import { createFileRoute } from '@tanstack/react-router'
import AdminApbdes from '../../../components/pages/admin/AdminApbdes'

export const Route = createFileRoute('/admin/infografis/apbdes')({
  component: AdminApbdes,
})
