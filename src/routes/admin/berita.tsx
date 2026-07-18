import { createFileRoute } from '@tanstack/react-router';
import AdminBerita from '../../components/pages/admin/AdminBerita';

export const Route = createFileRoute('/admin/berita')({
  component: AdminBerita,
});
