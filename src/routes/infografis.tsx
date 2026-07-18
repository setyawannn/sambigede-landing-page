import { createFileRoute } from '@tanstack/react-router';
import InfografisLayout from '../components/pages/infografis/InfografisLayout';

export const Route = createFileRoute('/infografis')({
  component: InfografisLayout,
});
