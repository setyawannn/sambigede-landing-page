import { createFileRoute } from '@tanstack/react-router'
import StuntingTab from '../../components/pages/infografis/StuntingTab'

export const Route = createFileRoute('/infografis/stunting')({
  component: StuntingTab,
})
