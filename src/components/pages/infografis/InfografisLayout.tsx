import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { Users, Package, Activity, Landmark, PieChart } from 'lucide-react'

export default function InfografisLayout() {
  const location = useLocation()
  const pathname = location.pathname

  const tabs = [
    {
      name: 'Kependudukan',
      path: '/infografis/penduduk',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: 'APBDes',
      path: '/infografis/apbdes',
      icon: <Landmark className="w-5 h-5" />,
    },
    {
      name: 'Stunting',
      path: '/infografis/stunting',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      name: 'Bansos',
      path: '/infografis/bansos',
      icon: <Package className="w-5 h-5" />,
    },
  ]

  return (
    <div className="flex flex-col w-full bg-[#F5F5F5] min-h-screen pb-20">
      <div className="bg-white py-12 md:py-16 border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#3F7D4A]/10 text-[#3F7D4A] px-4 py-1.5 rounded-full mb-6 mx-auto">
            <PieChart className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              Transparansi Data
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#333] mb-6">
            Infografis & Data Desa
          </h1>
          <p className="text-[#666] max-w-[600px] mx-auto text-sm md:text-base mb-10">
            Wujud transparansi pemerintahan Desa Sambigede dalam menyajikan data
            kependudukan, anggaran, kesehatan, dan bantuan sosial.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-2 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl max-w-fit mx-auto">
            {tabs.map((tab) => {
              const isActive =
                pathname.startsWith(tab.path) ||
                (pathname === '/infografis' &&
                  tab.path === '/infografis/penduduk')
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#3F7D4A] text-white shadow-md shadow-[#3F7D4A]/20'
                      : 'text-[#666] hover:bg-[#3F7D4A]/10 hover:text-[#3F7D4A]'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 w-full mt-10">
        <Outlet />
      </div>
    </div>
  )
}
