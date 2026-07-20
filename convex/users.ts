import { query } from './_generated/server'

export const getAdminUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('admin_users').collect()
    // Only return safe fields (exclude passwordHash)
    return users.map((u) => ({
      _id: u._id,
      username: u.username,
      nama: u.nama,
      role: u.role,
    }))
  },
})
