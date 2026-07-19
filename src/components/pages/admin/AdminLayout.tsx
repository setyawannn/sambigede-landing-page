import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { 
  LayoutDashboard, Newspaper, Settings, LogOut, Bell, Database, ChevronDown, PieChart, Landmark,
  Building2, Handshake, Users, FolderOpen, Home, Phone, ShieldAlert
} from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../../lib/auth";
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton
} from "../../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

import { Toaster } from "../../ui/sonner";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/login", replace: true });
    }
  }, [user, isLoading, navigate]);

  // Early returns removed to allow layout CSR rendering

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Kelola Berita", path: "/admin/berita", icon: Newspaper },
    { name: "Pengaduan & Log", path: "/admin/pengaduan", icon: ShieldAlert },
    { name: "Pengaturan", path: "/admin/settings", icon: Settings },
  ];

  const infografisItems = [
    { name: "Data Penduduk", path: "/admin/penduduk" },
    { name: "Penerima Bansos", path: "/admin/bansos" },
    { name: "Stunting", path: "/admin/stunting" },
    { name: "Keuangan APBDes", path: "/admin/apbdes" },
  ];

  const masterDataItems = [
    { name: "Kategori Berita", path: "/admin/kategori" },
    { name: "Kategori Pengaduan", path: "/admin/kategori-pengaduan" },
  ];

  const kelolaKontenItems = [
    { name: "Beranda", path: "/admin/beranda", icon: Home },
    { name: "Profil Desa & Visi Misi", path: "/admin/profil", icon: Building2 },
    { name: "Kelembagaan", path: "/admin/kelembagaan", icon: Handshake },
    { name: "Perangkat Desa", path: "/admin/perangkat", icon: Users },
    { name: "Informasi Kontak", path: "/admin/kontak", icon: Phone },
  ];

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const isInfografisActive = infografisItems.some(item => location.pathname.startsWith(item.path));
  const isMasterDataActive = masterDataItems.some(item => location.pathname.startsWith(item.path));
  const isKelolaKontenActive = kelolaKontenItems.some(item => location.pathname.startsWith(item.path));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar collapsible="icon" variant="sidebar" className="border-r bg-white">
          <SidebarHeader className="h-16 flex flex-row items-center gap-2 px-4 border-b">
            <Landmark className="w-6 h-6 text-primary shrink-0" />
            <h1 className="text-primary font-bold text-lg tracking-wider truncate group-data-[collapsible=icon]:hidden">Sambigede Admin</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Menu Utama
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive} 
                          tooltip={item.name}
                          className={isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : ""}
                        >
                          <Link to={item.path} className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}

                  <Collapsible defaultOpen={isKelolaKontenActive} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip="Kelola Konten" isActive={isKelolaKontenActive}>
                          <FolderOpen className="w-5 h-5" />
                          <span className="group-data-[collapsible=icon]:hidden">Kelola Konten</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                          {kelolaKontenItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                              <SidebarMenuSubItem key={item.name}>
                                <SidebarMenuSubButton asChild isActive={isActive} className={isActive ? "bg-slate-100 font-medium text-primary" : ""}>
                                  <Link to={item.path} className="flex items-center gap-2">
                                    <item.icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <Collapsible defaultOpen={isInfografisActive} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip="Infografis" isActive={isInfografisActive}>
                          <PieChart className="w-5 h-5" />
                          <span className="group-data-[collapsible=icon]:hidden">Infografis</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                          {infografisItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                              <SidebarMenuSubItem key={item.name}>
                                <SidebarMenuSubButton asChild isActive={isActive} className={isActive ? "bg-slate-100 font-medium text-primary" : ""}>
                                  <Link to={item.path}>
                                    <span>{item.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>

                  <Collapsible defaultOpen={isMasterDataActive} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip="Master Data" isActive={isMasterDataActive}>
                          <Database className="w-5 h-5" />
                          <span className="group-data-[collapsible=icon]:hidden">Master Data</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
                          {masterDataItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                              <SidebarMenuSubItem key={item.name}>
                                <SidebarMenuSubButton asChild isActive={isActive} className={isActive ? "bg-slate-100 font-medium text-primary" : ""}>
                                  <Link to={item.path}>
                                    <span>{item.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-slate-100">
             <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <LogOut className="w-5 h-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Logout</span>
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
              <Button variant="ghost" size="icon" className="relative text-slate-500">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </Button>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold text-slate-800 leading-none">
                    {isLoading || !user ? <Skeleton className="h-4 w-20 ml-auto" /> : user.nama}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {isLoading || !user ? <Skeleton className="h-3 w-12 ml-auto" /> : user.role}
                  </div>
                </div>
                <Avatar className="h-9 w-9 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.nama.charAt(0).toUpperCase() || "?"}
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
  );
}
