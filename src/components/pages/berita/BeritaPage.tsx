import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Newspaper, Search, Filter } from 'lucide-react'
import { BeritaCard } from './BeritaCard'
import { Skeleton } from '../../ui/skeleton'

export default function BeritaPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  const kategoriData = useQuery(api.kategori.getKategori) || []
  const categories = ['Semua', ...kategoriData.map((k) => k.nama)]

  // Fetch berita using Convex query
  const beritaList = useQuery(api.berita.getBerita, {
    category: activeCategory === 'Semua' ? undefined : activeCategory,
  })

  // Filter local for search query
  const filteredBerita = beritaList?.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col w-full bg-[#F5F5F5] min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white py-12 md:py-16 border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#3F7D4A]/10 text-[#3F7D4A] px-4 py-1.5 rounded-full mb-6 mx-auto">
            <Newspaper className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              Kabar Desa
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#333] mb-6">
            Berita & Pengumuman
            <br />
            Terbaru Desa Sambigede
          </h1>
          <p className="text-[#666] max-w-[600px] mx-auto text-sm md:text-base mb-10">
            Dapatkan informasi terkini seputar program desa, kegiatan
            masyarakat, pembangunan, dan pengumuman resmi dari Pemerintah Desa
            Sambigede.
          </p>

          {/* Search Bar */}
          <div className="max-w-[500px] mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#3F7D4A] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari berita atau pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9F9F9] border-2 border-transparent focus:border-[#3F7D4A]/30 focus:bg-white text-gray-800 rounded-full py-4 pl-12 pr-6 outline-none transition-all shadow-sm focus:shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-[1200px] mx-auto px-6 w-full mt-10">
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-5 h-5 text-[#666] shrink-0 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                ${
                  activeCategory === cat
                    ? 'bg-[#3F7D4A] text-white shadow-md shadow-[#3F7D4A]/20'
                    : 'bg-white text-[#666] border border-[#E5E5E5] hover:border-[#3F7D4A] hover:text-[#3F7D4A]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {beritaList === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 flex flex-col gap-4"
              >
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : filteredBerita && filteredBerita.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBerita.map((berita) => (
              <BeritaCard key={berita._id} id={berita._id} {...berita} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#333] mb-2">
              Tidak Ada Berita Ditemukan
            </h3>
            <p className="text-[#666]">
              Maaf, kami tidak menemukan berita yang sesuai dengan kategori atau
              pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('Semua')
              }}
              className="mt-6 text-[#3F7D4A] font-bold hover:underline"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
