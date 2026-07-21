import { createFileRoute } from '@tanstack/react-router'
import BeritaDetailPage from '../../components/pages/berita/BeritaDetailPage'

export const Route = createFileRoute('/berita/$slug')({
  component: () => {
    const { slug } = Route.useParams()
    return <BeritaDetailPage slug={slug} />
  },
})
