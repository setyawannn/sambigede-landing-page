import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPenduduk = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("penduduk").collect();
  },
});

export const getPendudukByNik = query({
  args: { nik: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("penduduk")
      .withIndex("by_nik", (q) => q.eq("nik", args.nik))
      .first();
  },
});

export const batchInsertPenduduk = mutation({
  args: {
    data: v.array(
      v.object({
        nik: v.string(),
        nama: v.string(),
        ttl: v.string(),
        jk: v.union(v.literal("Laki-laki"), v.literal("Perempuan")),
        rt: v.string(),
        rw: v.string(),
        status: v.string(),
        pekerjaan: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.insert("penduduk", item);
    }
    return { success: true, count: args.data.length };
  },
});

export const clearPenduduk = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("penduduk").collect();
    for (const item of all) {
      await ctx.db.delete(item._id);
    }
    return { success: true, count: all.length };
  },
});

export const createPenduduk = mutation({
  args: {
    nik: v.string(),
    nama: v.string(),
    ttl: v.string(),
    jk: v.union(v.literal("Laki-laki"), v.literal("Perempuan")),
    rt: v.string(),
    rw: v.string(),
    status: v.string(),
    pekerjaan: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("penduduk", args);
  },
});

export const updatePenduduk = mutation({
  args: {
    id: v.id("penduduk"),
    nik: v.optional(v.string()),
    nama: v.optional(v.string()),
    ttl: v.optional(v.string()),
    jk: v.optional(v.union(v.literal("Laki-laki"), v.literal("Perempuan"))),
    rt: v.optional(v.string()),
    rw: v.optional(v.string()),
    status: v.optional(v.string()),
    pekerjaan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deletePenduduk = mutation({
  args: { id: v.id("penduduk") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
