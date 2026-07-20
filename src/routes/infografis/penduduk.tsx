import { createFileRoute } from '@tanstack/react-router'
import PendudukTab from '../../components/pages/infografis/PendudukTab'

export const Route = createFileRoute('/infografis/penduduk')({
  component: PendudukTab,
})
