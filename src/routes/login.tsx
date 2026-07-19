import { createFileRoute, useNavigate } from '@tanstack/react-router';
import LoginPage from '../components/pages/admin/LoginPage';
import { useAuth } from '../lib/auth';
import { useEffect } from 'react';

import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginRoute,
});

function LoginRoute() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: '/admin', replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#6B8E23] animate-spin" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect shortly
  }

  return <LoginPage />;
}
