import { createFileRoute } from '@tanstack/react-router';
import ProfilPage from '../components/pages/profil/ProfilPage';

export const Route = createFileRoute('/profil')({
  component: ProfilPage,
});
