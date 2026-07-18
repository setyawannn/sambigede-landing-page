import { createFileRoute } from '@tanstack/react-router';
import ApbdesTab from '../../components/pages/infografis/ApbdesTab';

export const Route = createFileRoute('/infografis/apbdes')({
  component: ApbdesTab,
});
