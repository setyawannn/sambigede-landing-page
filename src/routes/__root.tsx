import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/shared/Footer'
import Header from '../components/shared/Header'
import { Toaster } from '../components/ui/sonner'

import ConvexProvider, {
  convexHttpClient,
} from '../integrations/convex/provider'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import StoreDevtools from '../lib/demo-store-devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { AuthProvider } from '../lib/auth'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var root=document.documentElement;root.classList.remove('dark');root.classList.add('light');root.setAttribute('data-theme','light');root.style.colorScheme='light';}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Desa Sambigede' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  loader: async ({ context: { queryClient } }) => {
    if (typeof document === 'undefined') {
      const kontakData = await convexHttpClient.query(
        api.kontak.getKontakConfig,
        {},
      )
      queryClient.setQueryData(
        convexQuery(api.kontak.getKontakConfig, {}).queryKey,
        kontakData ?? null,
      )
    } else {
      await queryClient.ensureQueryData(
        convexQuery(api.kontak.getKontakConfig, {}),
      )
    }
  },
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const isAdminOrLogin =
    pathname.startsWith('/admin') || pathname.startsWith('/login')

  if (isAdminOrLogin) {
    return (
      <html lang="id" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
          <HeadContent />
        </head>
        <body className="font-sans antialiased text-[#333] bg-[#F8FAFC]">
          <AuthProvider>
            <ConvexProvider>
              {children}
              <TanStackDevtools
                config={{ position: 'bottom-right' }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                  StoreDevtools,
                ]}
              />
            </ConvexProvider>
          </AuthProvider>
          <Scripts />
        </body>
      </html>
    )
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased text-[#333] bg-white selection:bg-[#3F7D4A]/20">
        <AuthProvider>
          <ConvexProvider>
            <div className="min-h-screen flex flex-col pt-[72px]">
              <Header />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
            </div>
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
                StoreDevtools,
              ]}
            />
          </ConvexProvider>
        </AuthProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
