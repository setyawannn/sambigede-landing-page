import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPerangkatList = query({
  args: {
    status: v.optional(v.union(v.literal("Aktif"), v.literal("Nonaktif"))),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("perangkat_desa").withIndex("by_urutan");
    
    // Fallback filter if status is provided, since we can't easily chain indexes
    const data = await q.collect();
    if (args.status) {
      return data.filter(p => p.status === args.status);
    }
    return data;
  },
});

export const createPerangkat = mutation({
  args: {
    nama: v.string(),
    jabatan: v.string(),
    imageUrl: v.string(),
    imageKey: v.optional(v.string()),
    urutan: v.number(),
    status: v.union(v.literal("Aktif"), v.literal("Nonaktif")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("perangkat_desa", args);
  },
});

export const updatePerangkat = mutation({
  args: {
    id: v.id("perangkat_desa"),
    nama: v.optional(v.string()),
    jabatan: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageKey: v.optional(v.string()),
    urutan: v.optional(v.number()),
    status: v.optional(v.union(v.literal("Aktif"), v.literal("Nonaktif"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deletePerangkat = mutation({
  args: { id: v.id("perangkat_desa") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
