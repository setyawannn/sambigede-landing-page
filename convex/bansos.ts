import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBansos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bansos").collect();
  },
});

export const batchInsertBansos = mutation({
  args: {
    data: v.array(
      v.object({
        nik: v.string(),
        nama: v.string(),
        jk: v.union(v.literal("Laki-laki"), v.literal("Perempuan"), v.literal("-")),
        rt: v.string(),
        rw: v.string(),
        jenisBansos: v.union(
          v.literal("PKH"),
          v.literal("BPNT"),
          v.literal("BLT Dana Desa"),
          v.literal("Bantuan Dana Pangan"),
          v.literal("Lainnya")
        ),
        nominal: v.string(),
        periode: v.string(),
        status: v.union(v.literal("Aktif"), v.literal("Selesai")),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.insert("bansos", item);
    }
    return { success: true, count: args.data.length };
  },
});

export const clearBansos = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("bansos").collect();
    for (const item of all) {
      await ctx.db.delete(item._id);
    }
    return { success: true, count: all.length };
  },
});

export const createBansos = mutation({
  args: {
    nik: v.string(),
    nama: v.string(),
    jk: v.union(v.literal("Laki-laki"), v.literal("Perempuan"), v.literal("-")),
    rt: v.string(),
    rw: v.string(),
    jenisBansos: v.union(
      v.literal("PKH"),
      v.literal("BPNT"),
      v.literal("BLT Dana Desa"),
      v.literal("Bantuan Dana Pangan"),
      v.literal("Lainnya")
    ),
    nominal: v.string(),
    periode: v.string(),
    status: v.union(v.literal("Aktif"), v.literal("Selesai")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bansos", args);
  },
});

export const updateBansos = mutation({
  args: {
    id: v.id("bansos"),
    nik: v.optional(v.string()),
    nama: v.optional(v.string()),
    jk: v.optional(v.union(v.literal("Laki-laki"), v.literal("Perempuan"), v.literal("-"))),
    rt: v.optional(v.string()),
    rw: v.optional(v.string()),
    jenisBansos: v.optional(v.union(
      v.literal("PKH"),
      v.literal("BPNT"),
      v.literal("BLT Dana Desa"),
      v.literal("Bantuan Dana Pangan"),
      v.literal("Lainnya")
    )),
    nominal: v.optional(v.string()),
    periode: v.optional(v.string()),
    status: v.optional(v.union(v.literal("Aktif"), v.literal("Selesai"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteBansos = mutation({
  args: { id: v.id("bansos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
