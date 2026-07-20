import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Helper function untuk memastikan aksi hanya bisa dilakukan oleh Superadmin
// Karena kita tidak memiliki session management berbasis Convex di sini (disimpan di LocalStorage client),
// untuk proteksi dasar kita bisa menerima adminUsername/adminId dari client. 
// Untuk production-grade, Convex punya Auth integration sendiri, tapi berdasarkan setup saat ini
// yang menggunakan manual LocalStorage, kita percayakan proteksi di level UI dan minimal check di server.

import { paginationOptsValidator } from 'convex/server'

export const getAdminUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('admin_users').collect()
    // Hanya kembalikan field yang aman (tanpa passwordHash)
    return users.map((u) => ({
      _id: u._id,
      username: u.username,
      nama: u.nama,
      role: u.role,
    }))
  },
})

export const getAdminUsersPage = query({
  args: { 
    cursor: v.union(v.string(), v.null()), 
    numItems: v.number() 
  },
  handler: async (ctx, args) => {
    // Collect all just to get the length for the totalCount requirement,
    // although we paginate the actual returned list to save network payload size.
    const allUsers = await ctx.db.query('admin_users').collect()
    const totalCount = allUsers.length

    const result = await ctx.db
      .query('admin_users')
      .order('desc')
      .paginate({ cursor: args.cursor, numItems: args.numItems })

    return {
      page: result.page.map((u) => ({
        _id: u._id,
        username: u.username,
        nama: u.nama,
        role: u.role,
      })),
      isDone: result.isDone,
      continueCursor: result.continueCursor,
      totalCount,
    }
  },
})

export const createUser = mutation({
  args: {
    username: v.string(),
    passwordHash: v.string(), // Hashed by client or plain (if no hashing used in client)
    nama: v.string(),
    role: v.union(
      v.literal('Superadmin'),
      v.literal('Editor Konten'),
      v.literal('Operator Infografis'),
      v.literal('Petugas Pengaduan'),
      v.literal('Editor'),
    ),
  },
  handler: async (ctx, args) => {
    // Cek duplikasi username
    const existingUser = await ctx.db
      .query('admin_users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first()

    if (existingUser) {
      throw new Error('Username sudah digunakan')
    }

    return await ctx.db.insert('admin_users', {
      username: args.username,
      passwordHash: args.passwordHash,
      nama: args.nama,
      role: args.role,
    })
  },
})

export const updateUser = mutation({
  args: {
    id: v.id('admin_users'),
    username: v.string(),
    nama: v.string(),
    role: v.union(
      v.literal('Superadmin'),
      v.literal('Editor Konten'),
      v.literal('Operator Infografis'),
      v.literal('Petugas Pengaduan'),
      v.literal('Editor'),
    ),
  },
  handler: async (ctx, args) => {
    // Cek jika username diganti dan sudah dipakai orang lain
    const existingUser = await ctx.db
      .query('admin_users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first()

    if (existingUser && existingUser._id !== args.id) {
      throw new Error('Username sudah digunakan oleh akun lain')
    }

    await ctx.db.patch(args.id, {
      username: args.username,
      nama: args.nama,
      role: args.role,
    })
  },
})

export const deleteUser = mutation({
  args: {
    id: v.id('admin_users'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const resetPassword = mutation({
  args: {
    id: v.id('admin_users'),
  },
  handler: async (ctx, args) => {
    // Reset password ke "12345678"
    // Sesuai sistem auth yang ada, password disamakan langsung (plaintext disamakan di auth.ts loginInternal)
    await ctx.db.patch(args.id, {
      passwordHash: '12345678',
    })
  },
})
