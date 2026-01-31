import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get active tournament
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tournaments")
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();
  },
});

// Get tournament by external ID
export const getByExternalId = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tournaments")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();
  },
});

// List all tournaments
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("upcoming"),
        v.literal("active"),
        v.literal("completed")
      )
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("tournaments");
    const all = await query.collect();
    
    if (args.status) {
      return all.filter((t) => t.status === args.status);
    }
    return all;
  },
});

// Create a tournament
export const create = mutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    status: v.optional(
      v.union(
        v.literal("upcoming"),
        v.literal("active"),
        v.literal("completed")
      )
    ),
    grid64Url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tournaments")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();

    if (existing) {
      return { success: false, error: "Tournament with this ID already exists", id: existing._id };
    }

    const id = await ctx.db.insert("tournaments", {
      externalId: args.externalId,
      name: args.name,
      status: args.status ?? "upcoming",
      grid64Url: args.grid64Url,
      createdAt: Date.now(),
    });

    return { success: true, id };
  },
});

// Update tournament status
export const updateStatus = mutation({
  args: {
    externalId: v.string(),
    status: v.union(
      v.literal("upcoming"),
      v.literal("active"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const tournament = await ctx.db
      .query("tournaments")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();

    if (!tournament) {
      return { success: false, error: "Tournament not found" };
    }

    await ctx.db.patch(tournament._id, { status: args.status });
    return { success: true };
  },
});

// Set current round
export const setCurrentRound = mutation({
  args: {
    externalId: v.string(),
    round: v.number(),
  },
  handler: async (ctx, args) => {
    const tournament = await ctx.db
      .query("tournaments")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();

    if (!tournament) {
      return { success: false, error: "Tournament not found" };
    }

    await ctx.db.patch(tournament._id, { currentRound: args.round });
    return { success: true };
  },
});
