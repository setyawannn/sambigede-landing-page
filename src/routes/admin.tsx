import { createFileRoute } from '@tanstack/react-router';
import AdminLayout from '../components/pages/admin/AdminLayout';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});
