import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const login = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("admin_users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!user) {
      return { success: false, message: "Username atau password salah" };
    }

    if (user.passwordHash !== args.password) {
      return { success: false, message: "Username atau password salah" };
    }

    return {
      success: true,
      user: {
        id: user._id,
        username: user.username,
        nama: user.nama,
        role: user.role,
      },
    };
  },
});
