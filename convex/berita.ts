import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { paginationOptsValidator } from 'convex/server'

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

async function getUniqueSlug(db: any, title: string, excludeId?: string): Promise<string> {
  const baseSlug = slugify(title) || 'berita'
  let slug = baseSlug
  let count = 1
  while (true) {
    const existing = await db
      .query('berita')
      .withIndex('by_slug', (q: any) => q.eq('slug', slug))
      .first()
    if (!existing || existing._id === excludeId) {
      break
    }
    slug = `${baseSlug}-${count}`
    count++
  }
  return slug
}

export const getBeritaListFiltered = query({
  args: {
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q: any = ctx.db.query('berita')

    // Use search index if title is provided
    if (args.title && args.title.trim() !== '') {
      const titleSearch = args.title.trim()
      return await ctx.db
        .query('berita')
        .withSearchIndex('search_title', (q) => {
          let search = q.search('title', titleSearch)
          if (args.category && args.category !== 'Semua') {
            search = search.eq('category', args.category)
          }
          if (args.author && args.author !== 'Semua') {
            search = search.eq('author', args.author)
          }
          return search
        })
        .collect()
    }

    // Otherwise use regular indexes
    if (args.category && args.category !== 'Semua') {
      q = q.withIndex('by_category', (dbQ: any) =>
        dbQ.eq('category', args.category!),
      )
    } else if (args.author && args.author !== 'Semua') {
      q = q.withIndex('by_author', (dbQ: any) => dbQ.eq('author', args.author!))
    }

    // Filter remaining conditions (since we can't filter string easily without eq, we just check exact matches for the remaining)
    q = q.filter((dbQ: any) => {
      const conds = []
      if (args.category && args.category !== 'Semua' && !args.author) {
        conds.push(dbQ.eq(dbQ.field('category'), args.category))
      }
      if (
        args.author &&
        args.author !== 'Semua' &&
        args.category &&
        args.category !== 'Semua'
      ) {
        conds.push(dbQ.eq(dbQ.field('author'), args.author))
      }

      if (conds.length === 0) return true
      if (conds.length === 1) return conds[0]
      return dbQ.and(...conds)
    })

    return await q.order('desc').collect()
  },
})

export const getBeritaPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q: any = ctx.db.query('berita')

    // Use search index if title is provided
    if (args.title && args.title.trim() !== '') {
      const titleSearch = args.title.trim()
      return await ctx.db
        .query('berita')
        .withSearchIndex('search_title', (q) => {
          let search = q.search('title', titleSearch)
          if (args.category && args.category !== 'Semua') {
            search = search.eq('category', args.category)
          }
          if (args.author && args.author !== 'Semua') {
            search = search.eq('author', args.author)
          }
          return search
        })
        .paginate(args.paginationOpts)
    }

    // Otherwise use regular indexes
    if (args.category && args.category !== 'Semua') {
      q = q.withIndex('by_category', (dbQ: any) =>
        dbQ.eq('category', args.category!),
      )
    } else if (args.author && args.author !== 'Semua') {
      q = q.withIndex('by_author', (dbQ: any) => dbQ.eq('author', args.author!))
    }

    // Filter remaining conditions (since we can't filter string easily without eq, we just check exact matches for the remaining)
    q = q.filter((dbQ: any) => {
      const conds = []
      if (args.category && args.category !== 'Semua' && !args.author) {
        // If we didn't index by category because author was provided, we filter it here
        // Wait, if author is provided, it uses by_author, so category needs to be filtered here!
        conds.push(dbQ.eq(dbQ.field('category'), args.category))
      }
      if (
        args.author &&
        args.author !== 'Semua' &&
        args.category &&
        args.category !== 'Semua'
      ) {
        // If we used by_category index, we filter author here!
        conds.push(dbQ.eq(dbQ.field('author'), args.author))
      }

      if (conds.length === 0) return true
      if (conds.length === 1) return conds[0]
      return dbQ.and(...conds)
    })

    return await q.order('desc').paginate(args.paginationOpts)
  },
})

export const getBerita = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category && args.category !== 'Semua') {
      return await ctx.db
        .query('berita')
        .withIndex('by_category', (q) => q.eq('category', args.category!))
        .order('desc')
        .collect()
    }

    return await ctx.db.query('berita').order('desc').collect()
  },
})

export const getBeritaById = query({
  args: { id: v.id('berita') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getBeritaBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('berita')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()
  },
})

export const createBerita = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    imageKey: v.optional(v.string()),
    author: v.string(),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const slug = args.slug || (await getUniqueSlug(ctx.db, args.title))
    return await ctx.db.insert('berita', {
      ...args,
      slug,
    })
  },
})

export const updateBerita = mutation({
  args: {
    id: v.id('berita'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageKey: v.optional(v.string()),
    author: v.optional(v.string()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    if (updates.title) {
      const current = await ctx.db.get(id)
      if (current && current.title !== updates.title) {
        updates.slug = updates.slug || (await getUniqueSlug(ctx.db, updates.title, id))
      }
    }
    return await ctx.db.patch(id, updates)
  },
})

export const deleteBerita = mutation({
  args: { id: v.id('berita') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const migrateBeritaSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const allBerita = await ctx.db.query('berita').collect()
    let count = 0
    for (const b of allBerita) {
      if (!b.slug) {
        const slug = await getUniqueSlug(ctx.db, b.title, b._id)
        await ctx.db.patch(b._id, { slug })
        count++
      }
    }
    return { success: true, migrated: count }
  },
})
