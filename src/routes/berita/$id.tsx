import { createFileRoute } from '@tanstack/react-router';
import BeritaDetailPage from '../../components/pages/berita/BeritaDetailPage';

export const Route = createFileRoute('/berita/$id')({
  component: () => {
    const { id } = Route.useParams();
    return <BeritaDetailPage id={id} />;
  },
});
