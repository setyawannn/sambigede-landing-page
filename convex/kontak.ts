import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getKontakConfig = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("kontak_config").first();
  },
});

export const updateKontakConfig = mutation({
  args: {
    alamat: v.string(),
    teleponKantor: v.string(),
    teleponDarurat: v.string(),
    email: v.string(),
    jamPelayanan: v.string(),
    facebook: v.optional(v.string()),
    instagram: v.optional(v.string()),
    youtube: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("kontak_config").first();
    if (existing) {
      return await ctx.db.patch(existing._id, args);
    } else {
      return await ctx.db.insert("kontak_config", args);
    }
  },
});
