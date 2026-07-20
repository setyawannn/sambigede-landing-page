import { createFileRoute } from '@tanstack/react-router'
import BeritaPage from '../../components/pages/berita/BeritaPage'

export const Route = createFileRoute('/berita/')({
  component: BeritaPage,
})
