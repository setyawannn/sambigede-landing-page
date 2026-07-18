import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/infografis/')({
  beforeLoad: () => {
    throw redirect({
      to: '/infografis/penduduk',
      replace: true,
    });
  },
});
