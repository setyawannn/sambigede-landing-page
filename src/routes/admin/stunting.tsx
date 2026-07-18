import { createFileRoute } from '@tanstack/react-router';
import AdminStunting from '../../components/pages/admin/AdminStunting';

export const Route = createFileRoute('/admin/stunting')({
  component: AdminStunting,
});
