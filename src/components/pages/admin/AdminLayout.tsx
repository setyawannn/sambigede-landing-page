import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from '@tanstack/react-router'
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '../../ui/sidebar'
import {
  LayoutDashboard,
  Newspaper,
  PieChart,
  FolderOpen,
  Database,
  Activity,
  ChevronDown,
  LogOut,
  ShieldAlert,
  Settings,
  Globe,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../../ui/dropdown-menu'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb'
import { Avatar, AvatarFallback } from '../../ui/avatar'
import { ScrollArea } from '../../ui/scroll-area'

export default function AdminLayout() {
  const [mounted, setMounted] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isLoading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login', replace: true })
    }
  }, [user, isLoading, navigate])

  const userRole = user?.role || ''

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ...(userRole === 'Superadmin' || userRole === 'Editor Konten' || userRole === 'Editor'
      ? [{ name: 'Kelola Berita', path: '/admin/berita', icon: Newspaper }]
      : []),
    ...(userRole === 'Superadmin' || userRole === 'Petugas Pengaduan'
      ? [{ name: 'Pengaduan & Log', path: '/admin/pengaduan', icon: ShieldAlert }]
      : []),
  ]

  const infografisItems =
    userRole === 'Superadmin' || userRole === 'Operator Infografis'
      ? [
          { name: 'Data Penduduk', path: '/admin/infografis/penduduk' },
          { name: 'Penerima Bansos', path: '/admin/infografis/bansos' },
          { name: 'Stunting', path: '/admin/infografis/stunting' },
          { name: 'Keuangan APBDes', path: '/admin/infografis/apbdes' },
        ]
      : []

  const masterDataItems = [
    ...(userRole === 'Superadmin' || userRole === 'Editor Konten' || userRole === 'Editor'
      ? [{ name: 'Kategori Berita', path: '/admin/master/kategori' }]
      : []),
    ...(userRole === 'Superadmin' || userRole === 'Petugas Pengaduan'
      ? [{ name: 'Kategori Pengaduan', path: '/admin/master/kategori-pengaduan' }]
      : []),
    ...(userRole === 'Superadmin'
      ? [{ name: 'Kelola User Admin', path: '/admin/master/users' }]
      : []),
  ]

  const analyticItems =
    userRole === 'Superadmin'
      ? [
          { name: 'Turnstile Security', path: '/admin/analytic/turnstile' },
          { name: 'Cloudflare R2', path: '/admin/analytic/r2' },
        ]
      : []

  const kelolaKontenItems =
    userRole === 'Superadmin' || userRole === 'Editor Konten' || userRole === 'Editor'
      ? [
          { name: 'Beranda', path: '/admin/konten/beranda' },
          { name: 'Profil Desa & Visi Misi', path: '/admin/konten/profil' },
          { name: 'Kelembagaan', path: '/admin/konten/kelembagaan' },
          { name: 'Perangkat Desa', path: '/admin/konten/perangkat' },
          { name: 'Ketua RT & RW', path: '/admin/konten/rt-rw' },
          { name: 'Informasi Kontak', path: '/admin/konten/kontak' },
        ]
      : []

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  // Breadcrumbs Helper
  const getBreadcrumbItems = () => {
    const paths = location.pathname.split('/').filter(Boolean)
    const items = []
    
    let currentPath = ''
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`
      let label = paths[i].charAt(0).toUpperCase() + paths[i].slice(1).replace(/-/g, ' ')
      
      // Map names logically
      if (paths[i] === 'admin') label = 'Dashboard'
      if (paths[i] === 'infografis') label = 'Infografis'
      if (paths[i] === 'konten') label = 'Konten'
      if (paths[i] === 'master') label = 'Master Data'
      
      // Make parents non-clickable if they don't have their own page (e.g. /admin/master)
      const hasNoPage = ['infografis', 'konten', 'master', 'analytic'].includes(paths[i])
      
      items.push({
        label,
        url: hasNoPage ? null : currentPath,
      })
    }
    
    return items
  }
  const breadcrumbs = getBreadcrumbItems()

  // Active state helpers
  const isInfografisActive = location.pathname.startsWith('/admin/infografis')
  const isMasterDataActive = location.pathname.startsWith('/admin/master')
  const isAnalyticActive = location.pathname.startsWith('/admin/analytic')
  const isKelolaKontenActive = location.pathname.startsWith('/admin/konten')

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 overflow-hidden">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="h-16 flex flex-row items-center px-6 border-b border-slate-100">
            <Link
              to="/admin"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity w-full"
            >
              <img 
                src="/images/logo-desa-sambigede.webp" 
                alt="Logo Desa Sambigede" 
                className="w-8 h-8 object-contain" 
              />
              <div className="flex flex-col justify-center pt-0.5">
                <span className="font-bold text-lg leading-none text-slate-800">
                  Sambigede
                </span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                  Admin Panel
                </span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            {/* GRUP 1: MENU UTAMA */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Menu Utama
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== '/admin' &&
                        location.pathname.startsWith(item.path + '/'))
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
            {kelolaKontenItems.length > 0 && (
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
                              const isActive =
                                location.pathname === item.path ||
                                location.pathname.startsWith(item.path + '/')
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
            )}

            {/* GRUP 3: DATA & INFOGRAFIS */}
            {infografisItems.length > 0 && (
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
                              const isActive =
                                location.pathname === item.path ||
                                location.pathname.startsWith(item.path + '/')
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
            )}

            {/* GRUP 4: SISTEM & PENGATURAN */}
            {(masterDataItems.length > 0 || analyticItems.length > 0 || userRole === 'Superadmin') && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Sistem & Pengaturan
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {masterDataItems.length > 0 && (
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
                                const isActive =
                                  location.pathname === item.path ||
                                  location.pathname.startsWith(item.path + '/')
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
                    )}

                    {analyticItems.length > 0 && (
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
                                const isActive =
                                  location.pathname === item.path ||
                                  location.pathname.startsWith(item.path + '/')
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
                    )}

                    {userRole === 'Superadmin' && (
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
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-md transition-colors" />
              <div className="hidden md:flex">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((item, index) => (
                      <div key={item.label} className="flex items-center">
                        <BreadcrumbItem>
                          {index === breadcrumbs.length - 1 ? (
                            <BreadcrumbPage className="font-semibold text-slate-800">
                              {item.label}
                            </BreadcrumbPage>
                          ) : item.url ? (
                            <BreadcrumbLink asChild>
                              <Link to={item.url}>{item.label}</Link>
                            </BreadcrumbLink>
                          ) : (
                            <span className="text-slate-500">{item.label}</span>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator className="mx-2" />
                        )}
                      </div>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 mr-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium text-slate-600">
                  Sistem Online
                </span>
              </div>

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors outline-none border border-transparent hover:border-slate-200">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                      {user.nama.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-slate-900">
                      {user.nama}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 hidden md:block" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-lg" sideOffset={8}>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                          {user.nama.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.nama}
                        </span>
                        <span className="truncate text-xs text-slate-500">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="cursor-pointer">
                      <Globe className="w-4 h-4 mr-2" />
                      Kembali ke Website
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <ScrollArea className="flex-1">
            <main className="p-6 md:p-8 flex flex-col min-h-full">
              <div className="w-full mx-auto max-w-full flex-1">
                <Outlet />
              </div>
            </main>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  )
}
