import { createFileRoute } from '@tanstack/react-router';
import TurnstileAnalytics from '../../../components/pages/admin/TurnstileAnalytics';

export const Route = createFileRoute('/admin/analytic/turnstile')({
  component: TurnstileAnalytics,
});
