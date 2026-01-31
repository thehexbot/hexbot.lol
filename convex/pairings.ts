import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get pairing for a specific player
export const getForPlayer = query({
  args: {
    playerName: v.string(),
    tournamentId: v.optional(v.string()),
    round: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find active tournament if not specified
    let tournamentId = args.tournamentId;
    if (!tournamentId) {
      const activeTournament = await ctx.db
        .query("tournaments")
        .filter((q) => q.eq(q.field("status"), "active"))
        .first();
      if (!activeTournament) {
        return { found: false, message: "No active tournament" };
      }
      tournamentId = activeTournament.externalId;
    }

    // Get current round from tournament or use provided
    let round = args.round;
    if (!round) {
      const tournament = await ctx.db
        .query("tournaments")
        .withIndex("by_externalId", (q) => q.eq("externalId", tournamentId!))
        .first();
      round = tournament?.currentRound ?? 1;
    }

    // Find pairing where player is white or black
    const asWhite = await ctx.db
      .query("pairings")
      .withIndex("by_player", (q) => q.eq("whiteName", args.playerName))
      .filter((q) =>
        q.and(
          q.eq(q.field("tournamentId"), tournamentId),
          q.eq(q.field("round"), round)
        )
      )
      .first();

    if (asWhite) {
      return {
        found: true,
        pairing: {
          round,
          color: "white",
          opponent: asWhite.blackName,
          result: asWhite.result,
          gameUrl: asWhite.gameUrl,
        },
      };
    }

    const asBlack = await ctx.db
      .query("pairings")
      .withIndex("by_player_black", (q) => q.eq("blackName", args.playerName))
      .filter((q) =>
        q.and(
          q.eq(q.field("tournamentId"), tournamentId),
          q.eq(q.field("round"), round)
        )
      )
      .first();

    if (asBlack) {
      return {
        found: true,
        pairing: {
          round,
          color: "black",
          opponent: asBlack.whiteName,
          result: asBlack.result,
          gameUrl: asBlack.gameUrl,
        },
      };
    }

    return { found: false, message: "No pairing found for this round" };
  },
});

// Create/update pairings (TD action - typically from scraping Grid64)
export const upsertPairing = mutation({
  args: {
    tournamentId: v.string(),
    round: v.number(),
    whiteName: v.string(),
    blackName: v.string(),
    result: v.optional(v.string()),
    gameUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pairings")
      .filter((q) =>
        q.and(
          q.eq(q.field("tournamentId"), args.tournamentId),
          q.eq(q.field("round"), args.round),
          q.eq(q.field("whiteName"), args.whiteName),
          q.eq(q.field("blackName"), args.blackName)
        )
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        result: args.result,
        gameUrl: args.gameUrl,
        updatedAt: Date.now(),
      });
      return { success: true, updated: true, id: existing._id };
    }

    const id = await ctx.db.insert("pairings", {
      tournamentId: args.tournamentId,
      round: args.round,
      whiteName: args.whiteName,
      blackName: args.blackName,
      result: args.result,
      gameUrl: args.gameUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true, updated: false, id };
  },
});

// Get all pairings for a round
export const getForRound = query({
  args: {
    tournamentId: v.string(),
    round: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pairings")
      .withIndex("by_tournament_round", (q) =>
        q.eq("tournamentId", args.tournamentId).eq("round", args.round)
      )
      .collect();
  },
});

// Report game result
export const reportResult = mutation({
  args: {
    tournamentId: v.string(),
    round: v.number(),
    whiteName: v.string(),
    result: v.string(), // "1-0", "0-1", "1/2-1/2"
    gameUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const pairing = await ctx.db
      .query("pairings")
      .filter((q) =>
        q.and(
          q.eq(q.field("tournamentId"), args.tournamentId),
          q.eq(q.field("round"), args.round),
          q.eq(q.field("whiteName"), args.whiteName)
        )
      )
      .first();

    if (!pairing) {
      return { success: false, error: "Pairing not found" };
    }

    await ctx.db.patch(pairing._id, {
      result: args.result,
      gameUrl: args.gameUrl,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
