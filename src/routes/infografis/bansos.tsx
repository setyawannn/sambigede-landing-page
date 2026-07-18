import { createFileRoute } from '@tanstack/react-router';
import BansosTab from '../../components/pages/infografis/BansosTab';

export const Route = createFileRoute('/infografis/bansos')({
  component: BansosTab,
});
