import { createFileRoute } from '@tanstack/react-router'
import R2Analytics from '../../../components/pages/admin/R2Analytics'

export const Route = createFileRoute('/admin/analytic/r2')({
  component: R2Analytics,
})
