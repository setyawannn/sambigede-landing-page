import { createFileRoute } from '@tanstack/react-router';
import KontakPage from '../components/pages/kontak/KontakPage';

export const Route = createFileRoute('/kontak')({
  component: KontakPage,
});
