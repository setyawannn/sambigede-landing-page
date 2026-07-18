import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBerita = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category && args.category !== "Semua") {
      return await ctx.db
        .query("berita")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .collect();
    }
    
    return await ctx.db.query("berita").order("desc").collect();
  },
});

export const getBeritaById = query({
  args: { id: v.id("berita") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createBerita = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    excerpt: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    imageKey: v.optional(v.string()),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("berita", args);
  },
});

export const updateBerita = mutation({
  args: {
    id: v.id("berita"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    category: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageKey: v.optional(v.string()),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteBerita = mutation({
  args: { id: v.id("berita") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
