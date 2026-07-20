import { Link } from '@tanstack/react-router'
import { Clock, User } from 'lucide-react'
import type { Id } from '../../../../convex/_generated/dataModel'
import R2Image from '../../ui/R2Image'

interface BeritaCardProps {
  id: Id<'berita'>
  title: string
  excerpt: string
  category: string
  imageUrl: string
  author: string
  _creationTime: number
}

export function BeritaCard({
  id,
  title,
  excerpt,
  category,
  imageUrl,
  author,
  _creationTime,
}: BeritaCardProps) {
  const date = new Date(_creationTime).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <R2Image
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallbackSrc="/images/placeholder.jpg"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#6B8E23] shadow-sm">
          {category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-xs text-[#666] mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{author}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#333] mb-3 line-clamp-2 group-hover:text-[#6B8E23] transition-colors">
          {title}
        </h3>

        <p className="text-[#666] text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {excerpt}
        </p>

        <Link
          to="/berita/$id"
          params={{ id }}
          className="inline-flex items-center text-sm font-bold text-[#6B8E23] hover:text-[#5A7A1E] transition-colors mt-auto"
        >
          Baca Selengkapnya
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
