import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Newspaper,
  Settings,
  LogOut,
  Bell,
  Database,
  ChevronDown,
  PieChart,
  Landmark,
  Building2,
  Handshake,
  Users,
  FolderOpen,
  Home,
  Phone,
  ShieldAlert,
  Activity,
} from 'lucide-react'
import { useEffect } from 'react'
import { useAuth } from '../../../lib/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '../../ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible'
import { Avatar, AvatarFallback } from '../../ui/avatar'
import { Button } from '../../ui/button'
import { Skeleton } from '../../ui/skeleton'

import { Toaster } from '../../ui/sonner'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login', replace: true })
    }
  }, [user, isLoading, navigate])

  // Early returns removed to allow layout CSR rendering

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Kelola Berita', path: '/admin/berita', icon: Newspaper },
    { name: 'Pengaduan & Log', path: '/admin/pengaduan', icon: ShieldAlert },
  ]

  const infografisItems = [
    { name: 'Data Penduduk', path: '/admin/penduduk' },
    { name: 'Penerima Bansos', path: '/admin/bansos' },
    { name: 'Stunting', path: '/admin/stunting' },
    { name: 'Keuangan APBDes', path: '/admin/apbdes' },
  ]

  const masterDataItems = [
    { name: 'Kategori Berita', path: '/admin/kategori' },
    { name: 'Kategori Pengaduan', path: '/admin/kategori-pengaduan' },
  ]

  const analyticItems = [
    { name: 'Turnstile Security', path: '/admin/analytic/turnstile' },
    { name: 'Cloudflare R2', path: '/admin/analytic/r2' },
  ]

  const kelolaKontenItems = [
    { name: 'Beranda', path: '/admin/beranda' },
    { name: 'Profil Desa & Visi Misi', path: '/admin/profil' },
    { name: 'Kelembagaan', path: '/admin/kelembagaan' },
    { name: 'Perangkat Desa', path: '/admin/perangkat' },
    { name: 'Informasi Kontak', path: '/admin/kontak' },
  ]

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  const isInfografisActive = infografisItems.some((item) =>
    location.pathname.startsWith(item.path),
  )
  const isMasterDataActive = masterDataItems.some((item) =>
    location.pathname.startsWith(item.path),
  )
  const isAnalyticActive = analyticItems.some((item) =>
    location.pathname.startsWith(item.path),
  )
  const isKelolaKontenActive = kelolaKontenItems.some((item) =>
    location.pathname.startsWith(item.path),
  )

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar
          collapsible="icon"
          variant="sidebar"
          className="border-r bg-white"
        >
          <SidebarHeader className="h-16 flex flex-row items-center gap-2 px-4 border-b">
            <Landmark className="w-6 h-6 text-primary shrink-0" />
            <h1 className="text-primary font-bold text-lg tracking-wider truncate group-data-[collapsible=icon]:hidden">
              Sambigede Admin
            </h1>
          </SidebarHeader>
          <SidebarContent>
            {/* GRUP 1: UTAMA */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Utama
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== '/admin' &&
                        location.pathname.startsWith(item.path))
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.name}
                          className={
                            isActive
                              ? '!bg-primary/10 !text-primary !font-semibold hover:!bg-primary/15'
                              : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                          }
                        >
                          <Link
                            to={item.path}
                            className="flex items-center gap-3"
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              {item.name}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* GRUP 2: KONTEN DESA */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Konten Desa
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible
                    defaultOpen={isKelolaKontenActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip="Halaman & Konten Desa"
                          isActive={isKelolaKontenActive}
                          className={
                            isKelolaKontenActive
                              ? '!text-primary !font-semibold !bg-transparent hover:!bg-primary/10'
                              : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                          }
                        >
                          <FolderOpen className="w-5 h-5" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Halaman & Konten Desa
                          </span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                          {kelolaKontenItems.map((item) => {
                            const isActive = location.pathname.startsWith(
                              item.path,
                            )
                            return (
                              <SidebarMenuSubItem key={item.name}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                  className={
                                    isActive
                                      ? '!bg-primary/10 !text-primary !font-semibold hover:!bg-primary/15'
                                      : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                                  }
                                >
                                  <Link
                                    to={item.path}
                                    className="flex items-center gap-2"
                                  >
                                    <span>{item.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* GRUP 3: DATA & INFOGRAFIS */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Data & Infografis
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible
                    defaultOpen={isInfografisActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip="Infografis Desa"
                          isActive={isInfografisActive}
                          className={
                            isInfografisActive
                              ? '!text-primary !font-semibold !bg-transparent hover:!bg-primary/10'
                              : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                          }
                        >
                          <PieChart className="w-5 h-5" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Infografis Desa
                          </span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                          {infografisItems.map((item) => {
                            const isActive = location.pathname.startsWith(
                              item.path,
                            )
                            return (
                              <SidebarMenuSubItem key={item.name}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                  className={
                                    isActive
                                      ? '!bg-primary/10 !text-primary !font-semibold hover:!bg-primary/15'
                                      : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                                  }
                                >
                                  <Link to={item.path}>
                                    <span>{item.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* GRUP 4: SISTEM & PENGATURAN */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Sistem & Pengaturan
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible
                    defaultOpen={isMasterDataActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip="Master Data"
                          isActive={isMasterDataActive}
                          className={
                            isMasterDataActive
                              ? '!text-primary !font-semibold !bg-transparent hover:!bg-primary/10'
                              : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                          }
                        >
                          <Database className="w-5 h-5" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Master Data
                          </span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                          {masterDataItems.map((item) => {
                            const isActive = location.pathname.startsWith(
                              item.path,
                            )
                            return (
                              <SidebarMenuSubItem key={item.name}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                  className={
                                    isActive
                                      ? '!bg-primary/10 !text-primary !font-semibold hover:!bg-primary/15'
                                      : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                                  }
                                >
                                  <Link to={item.path}>
                                    <span>{item.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <Collapsible
                    defaultOpen={isAnalyticActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip="Analitik Sistem"
                          isActive={isAnalyticActive}
                          className={
                            isAnalyticActive
                              ? '!text-primary !font-semibold !bg-transparent hover:!bg-primary/10'
                              : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                          }
                        >
                          <Activity className="w-5 h-5" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Analitik Sistem
                          </span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                          {analyticItems.map((item) => {
                            const isActive = location.pathname.startsWith(
                              item.path,
                            )
                            return (
                              <SidebarMenuSubItem key={item.name}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                  className={
                                    isActive
                                      ? '!bg-primary/10 !text-primary !font-semibold hover:!bg-primary/15'
                                      : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                                  }
                                >
                                  <Link to={item.path}>
                                    <span>{item.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === '/admin/settings'}
                      tooltip="Pengaturan"
                      className={
                        location.pathname === '/admin/settings'
                          ? '!bg-primary/10 !text-primary !font-semibold hover:!bg-primary/15'
                          : 'font-normal text-slate-600 hover:!bg-primary/10 hover:!text-primary'
                      }
                    >
                      <Link
                        to="/admin/settings"
                        className="flex items-center gap-3"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          Pengaturan
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-slate-100">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Logout
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-500" />
              <h2 className="hidden lg:block text-lg font-semibold text-slate-800">
                Sistem Informasi Desa Sambigede
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-500"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </Button>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold text-slate-800 leading-none">
                    {isLoading || !user ? (
                      <Skeleton className="h-4 w-20 ml-auto" />
                    ) : (
                      user.nama
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {isLoading || !user ? (
                      <Skeleton className="h-3 w-12 ml-auto" />
                    ) : (
                      user.role
                    )}
                  </div>
                </div>
                <Avatar className="h-9 w-9 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.nama.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {isLoading || !user ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <Skeleton className="h-12 w-full max-w-sm" />
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
