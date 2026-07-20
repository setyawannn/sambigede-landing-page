import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Link } from '@tanstack/react-router'
import { Clock, User, ChevronLeft, Calendar } from 'lucide-react'
import { Skeleton } from '../../ui/skeleton'
import type { Id } from '../../../../convex/_generated/dataModel'
import R2Image from '../../ui/R2Image'

interface BeritaDetailPageProps {
  id: string
}

export default function BeritaDetailPage({ id }: BeritaDetailPageProps) {
  // We assert the id string as Id<"berita"> for Convex typing
  const berita = useQuery(api.berita.getBeritaById, { id: id as Id<'berita'> })

  if (berita === undefined) {
    return (
      <div className="flex flex-col w-full bg-[#F5F5F5] min-h-screen pt-12 pb-20">
        <div className="max-w-[800px] mx-auto px-6 w-full">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-3/4 mb-8" />
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    )
  }

  if (berita === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] px-6 text-center">
        <h1 className="text-4xl font-bold text-[#333] mb-4">
          Berita Tidak Ditemukan
        </h1>
        <p className="text-[#666] mb-8">
          Maaf, berita yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Link
          to="/berita"
          className="bg-[#6B8E23] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#5A7A1E] transition-colors"
        >
          Kembali ke Daftar Berita
        </Link>
      </div>
    )
  }

  const date = new Date(berita._creationTime).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col w-full bg-white min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-[#F9F9F9] pt-12 pb-16 border-b border-[#E5E5E5]">
        <div className="max-w-[800px] mx-auto px-6">
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-[#666] hover:text-[#6B8E23] font-medium transition-colors mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            Kembali ke Berita
          </Link>

          <div className="inline-block bg-[#6B8E23]/10 text-[#6B8E23] px-3 py-1 rounded-full text-sm font-semibold mb-6">
            {berita.category}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#333] leading-tight mb-6">
            {berita.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[#666]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                Ditulis oleh: <strong>{berita.author}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[800px] mx-auto px-6 w-full -mt-8 relative z-10">
        <R2Image
          src={berita.imageUrl}
          alt={berita.title}
          className="w-full h-auto md:h-[500px] object-cover rounded-2xl shadow-lg border border-[#E5E5E5] bg-white mb-10"
          fallbackSrc="/images/placeholder.jpg"
        />

        <div className="prose prose-lg max-w-none text-[#444] leading-relaxed">
          {berita.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        <hr className="my-12 border-[#E5E5E5]" />

        <div className="flex items-center justify-between">
          <p className="text-[#666] text-sm">Bagikan artikel ini:</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
              f
            </button>
            <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
              t
            </button>
            <button className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
              w
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
