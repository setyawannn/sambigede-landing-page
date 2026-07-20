import { action, internalMutation, mutation } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'
import { verifyTurnstile } from './turnstile'

export const loginInternal = internalMutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('admin_users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first()

    if (!user) {
      return { success: false, message: 'Username atau password salah' }
    }

    if (user.passwordHash !== args.password) {
      return { success: false, message: 'Username atau password salah' }
    }

    return {
      success: true,
      user: {
        id: user._id,
        username: user.username,
        nama: user.nama,
        role: user.role,
      },
    }
  },
})

export const login = action({
  args: {
    username: v.string(),
    password: v.string(),
    turnstileToken: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const result = await verifyTurnstile(args.turnstileToken)

    await ctx.runMutation(internal.analytics.logTurnstileAttempt, {
      action: 'login',
      success: result.success,
      visitorId: args.visitorId,
      errorMessage: result.errorMessage,
    })

    if (!result.success) {
      return {
        success: false,
        message: 'Verifikasi keamanan (Turnstile) gagal. Silakan coba lagi.',
      }
    }

    const res = await ctx.runMutation(internal.auth.loginInternal, {
      username: args.username,
      password: args.password,
    })
    return res
  },
})
