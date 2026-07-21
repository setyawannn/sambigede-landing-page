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
import { ConvexHttpClient } from 'convex/browser'

import ConvexProvider, {
} from '../integrations/convex/provider'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import StoreDevtools from '../lib/demo-store-devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { AuthProvider } from '../lib/auth'
import {
  getServerEnvValue,
  getServerConvexUrl,
  hasValidServerConvexUrl,
  warnInvalidConvexUrlOnce,
} from '../lib/convex-env'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var root=document.documentElement;root.classList.remove('dark');root.classList.add('light');root.setAttribute('data-theme','light');root.style.colorScheme='light';}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/x-icon', sizes: '16x16', href: '/logo-sambigede-16.ico' },
      { rel: 'icon', type: 'image/x-icon', sizes: '32x32', href: '/logo-sambigede-32.ico' },
      { rel: 'icon', type: 'image/x-icon', sizes: '64x64', href: '/logo-sambigede-64.ico' },
    ],
  }),
  loader: async ({ context: { queryClient } }) => {
    try {
      if (typeof document === 'undefined') {
        if (!hasValidServerConvexUrl()) {
          warnInvalidConvexUrlOnce('SSR root loader dilewati')
          return
        }

        const serverConvexUrl = getServerConvexUrl()
        const serverConvexClient = new ConvexHttpClient(serverConvexUrl!)

        const kontakData = await serverConvexClient.query(
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
    } catch (error) {
      console.error('Gagal memuat konfigurasi kontak saat SSR:', error)
    }
  },
  shellComponent: RootDocument,
})

function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'Beranda'
  if (pathname.startsWith('/profil')) return 'Profil Desa'
  if (pathname.startsWith('/berita')) return 'Berita & Pengumuman'
  if (pathname.startsWith('/potensi')) return 'Potensi Desa'
  if (pathname.startsWith('/kelembagaan')) return 'Kelembagaan Desa'
  if (pathname.startsWith('/perangkat')) return 'Perangkat Desa'
  if (pathname.startsWith('/transparansi')) return 'Transparansi'
  if (pathname.startsWith('/layanan')) return 'Layanan Publik'
  if (pathname.startsWith('/kontak')) return 'Kontak'
  if (pathname.startsWith('/infografis')) return 'Infografis'
  if (pathname.startsWith('/admin')) return 'Dashboard Admin'
  if (pathname.startsWith('/login')) return 'Login Admin'
  return ''
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const pageTitle = getPageTitle(pathname)
  const titleText = pageTitle ? `Desa Sambigede | ${pageTitle}` : 'Desa Sambigede'
  const runtimeConvexUrl =
    typeof document === 'undefined' ? getServerConvexUrl() : undefined
  const runtimeTurnstileSiteKey =
    typeof document === 'undefined'
      ? getServerEnvValue('VITE_CLOUDFLARE_TURNSTILE_SITE_KEY')
      : undefined
  const appEnvPayload = Object.fromEntries(
    [
      ['VITE_CONVEX_URL', runtimeConvexUrl],
      ['VITE_CLOUDFLARE_TURNSTILE_SITE_KEY', runtimeTurnstileSiteKey],
    ].filter((entry): entry is [string, string] => Boolean(entry[1])),
  )
  const APP_ENV_INIT_SCRIPT =
    Object.keys(appEnvPayload).length > 0
      ? `window.__APP_ENV__=Object.assign(window.__APP_ENV__||{},${JSON.stringify(appEnvPayload)});`
      : ''
  const isAdminOrLogin =
    pathname.startsWith('/admin') || pathname.startsWith('/login')

  if (isAdminOrLogin) {
    return (
      <html lang="id" suppressHydrationWarning>
        <head>
          <title>{titleText}</title>
          <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
          {APP_ENV_INIT_SCRIPT ? (
            <script dangerouslySetInnerHTML={{ __html: APP_ENV_INIT_SCRIPT }} />
          ) : null}
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
          <Toaster />
          <Scripts />
        </body>
      </html>
    )
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <title>{titleText}</title>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {APP_ENV_INIT_SCRIPT ? (
          <script dangerouslySetInnerHTML={{ __html: APP_ENV_INIT_SCRIPT }} />
        ) : null}
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
